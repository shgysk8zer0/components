import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { displayMode } from '@shgysk8zer0/kazoo/media-queries.js';
import { getDeferred } from '@shgysk8zer0/kazoo/promises.js';
import { debounce } from '@shgysk8zer0/kazoo/events.js';
import styles from './window-controls.css.js';

const symbols = {
	shadow: Symbol('shadow'),
};

function getUpdateDisplayCallback(el) {
	return debounce(async () => {
		await Promise.all([
			el.loaded,
			el.connected,
		]);

		const titlebar = el[symbols.shadow].querySelector('slot[name="titlebar"]');
		const fallback = el[symbols.shadow].querySelector('slot[name="fallback"]');

		if (el.overlayVisible) {
			[el, titlebar, ...titlebar.assignedElements()].forEach(el => el.hidden = false);
			[fallback, ...fallback.assignedElements()].forEach(el => el.hidden = true);
		} else if (fallback.assignedElements().length === 0) {
			el.hidden = true;
		} else {
			[titlebar, ...titlebar.assignedElements()].forEach(el => el.hidden = true);
			[el, fallback, ...fallback.assignedElements()].forEach(el => el.hidden = false);
		}
	});
}

registerCustomElement('window-controls', class HTMLWindowControlsElements extends HTMLElement {
	constructor() {
		super();
		this[symbols.shadow] = this.attachShadow({ mode: 'closed' });
	}

	connectedCallback() {
		requestAnimationFrame(async () => {
			const container = document.createElement('div');
			const titlebar = document.createElement('slot');
			const fallback = document.createElement('slot');
			const grabRegion = document.createElement('div');

			titlebar.name = 'titlebar';
			fallback.name = 'fallback';
			titlebar.part.add('titlebar');
			fallback.part.add('fallback');
			grabRegion.part.add('grab-region');
			container.part.add('container');

			container.append(titlebar, fallback, grabRegion);
			this[symbols.shadow].adoptedStyleSheets = Promise.all([
				new CSSStyleSheet().replace(styles),
			]);

			this[symbols.shadow].append(container);
			this.dispatchEvent(new Event('load'));

			if (HTMLWindowControlsElements.supported && displayMode() !== 'browser') {
				const callback = getUpdateDisplayCallback(this);
				callback();
				navigator.windowControlsOverlay.addEventListener('geometrychange', callback);
				this.dispatchEvent(new Event('connected'));
			} else {
				const callback = getUpdateDisplayCallback(this);
				callback();
			}
		});
	}

	get connected() {
		const { resolve, promise } = getDeferred();

		if (this.isConnected) {
			resolve();
		} else {
			this.addEventListener('connected', () => resolve(), { once: true });
		}

		return promise;
	}

	get loaded() {
		const { resolve, promise } = getDeferred();

		if (this[symbols.shadow].childElementCount > 1) {
			resolve();
		} else {
			this.addEventListener('load', () => resolve(), { once: true });
		}

		return promise;
	}

	get titlebarAreaRect() {
		if (this.overlayVisible) {
			return navigator.windowControlsOverlay.getTitlebarAreaRect();
		} else {
			return this.getBoundingClientRect();
		}
	}

	get overlayVisible() {
		return HTMLWindowControlsElements.supported && navigator.windowControlsOverlay.visible;
	}

	get overlayHidden() {
		return ! this.overlayVisible;
	}

	static get supported() {
		return 'windowControlsOverlay' in navigator;
	}
});
