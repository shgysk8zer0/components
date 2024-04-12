import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { displayMode } from '@shgysk8zer0/kazoo/media-queries.js';
import { debounce } from '@shgysk8zer0/kazoo/events.js';
import styles from './window-controls.css.js';

function getUpdateDisplayCallback(el, shadow, internals) {
	return debounce(async () => {
		await Promise.all([
			el.loaded,
			el.connected,
		]);

		const titlebar = shadow.querySelector('slot[name="titlebar"]');
		const fallback = shadow.querySelector('slot[name="fallback"]');

		if (el.overlayVisible) {
			[el, titlebar, ...titlebar.assignedElements()].forEach(el => el.hidden = false);
			[fallback, ...fallback.assignedElements()].forEach(el => el.hidden = true);
			internals.ariaHidden = 'false';
			internals.states.add('--overlay');
			internals.states.delete('--fallabck');
		} else if (fallback.assignedElements().length === 0) {
			el.hidden = true;
			internals.ariaHidden = 'true';
			internals.states.delete('--overlay');
			internals.states.delete('--fallback');
		} else {
			[titlebar, ...titlebar.assignedElements()].forEach(el => el.hidden = true);
			[el, fallback, ...fallback.assignedElements()].forEach(el => el.hidden = false);
			internals.ariaHidden = 'false';
			internals.states.delete('--overlay');
			internals.states.add('--fallback');
		}
	});
}

registerCustomElement('window-controls', class HTMLWindowControlsElements extends HTMLElement {
	#shadow;
	#internals;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#internals = this.attachInternals();
		this.#internals.role = 'toolbar';
		this.#internals.ariaLabel = 'Site Toolbar';
		this.#internals.ariaHidden = 'true';
		this.#internals.states.add('--loading');
	}

	async connectedCallback() {
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

		this.#shadow.adoptedStyleSheets = await Promise.all([
			new CSSStyleSheet().replace(styles),
		]);

		this.#shadow.append(container);

		if (HTMLWindowControlsElements.supported && displayMode() !== 'browser') {
			const callback = getUpdateDisplayCallback(this, this.#shadow, this.#internals);
			callback();
			navigator.windowControlsOverlay.addEventListener('geometrychange', callback);
			this.dispatchEvent(new Event('connected'));
		} else {
			const callback = getUpdateDisplayCallback(this, this.#shadow, this.#internals);
			callback();
		}

		this.#internals.states.delete('--loading');
		this.dispatchEvent(new Event('load'));
	}

	get connected() {
		const { resolve, promise } = Promise.withResolvers();

		if (this.isConnected) {
			resolve();
		} else {
			this.addEventListener('connected', () => resolve(), { once: true });
		}

		return promise;
	}

	get loaded() {
		const { resolve, promise } = Promise.withResolvers();

		if (this.#shadow.childElementCount !== 0) {
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
