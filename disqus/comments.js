import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { whenIntersecting } from '@shgysk8zer0/kazoo/intersect.js';
import { getString, setString } from '@shgysk8zer0/kazoo/attrs.js';
import { loadScript, ID } from '@shgysk8zer0/kazoo/disqus.js';

const symbols = {
	shadow: Symbol('shadow'),
	internals: Symbol('internals'),
};

registerCustomElement('disqus-comments', class HTMLDisqusCommentsElement extends HTMLElement {
	constructor(site) {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });
		const internals = this.attachInternals();
		const slot = document.createElement('slot');
		const container = document.createElement('div');

		Object.defineProperties(this, {
			[symbols.shadow]: {
				enumerable: false,
				configurable: false,
				writable: false,
				value: shadow,
			},
			[symbols.internals]: {
				enumerable: false,
				configurable: false,
				writable: false,
				value: internals,
			}
		});

		container.slot = 'comments';
		container.id = ID;
		slot.name = 'comments';

		shadow.append(slot);
		this.append(container);
		internals.role = 'document';
		internals.ariaLabel = 'Disqus Comments';

		slot.addEventListener('slotchange', ({ target }) => {
			target.assignedElements().forEach(el => el.id = ID);
		});

		if (typeof site === 'string') {
			this.site = site;
		}
	}

	async attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'site':
				if (typeof oldVal === 'string') {
					const slot = this[symbols.shadow].querySelector('slot[name="comments"]');
					slot.assignedElements().forEach(el => el.remove());
				}

				if (typeof newVal === 'string' && newVal.length !== 0) {
					if (this.loading === 'lazy') {
						await whenIntersecting(this);
					}

					/**
					 * Can no longer load this script within the Shadow
					 */
					await loadScript(this.site);

					this.dispatchEvent(new Event('ready'));
				}
				break;

			default:
				throw new Error(`Unhandled attribute changed: "${name}"`);
		}
	}

	get ready() {
		if (this[symbols.shadow].childElementCount === 0) {
			return new Promise(resolve => this.addEventListener('ready', () => resolve(), { once: true }));
		} else{
			return Promise.resolve();
		}
	}

	get loading() {
		return getString(this, 'loading', { fallback: 'eager' });
	}

	set loading(val) {
		setString(this, 'loading', val);
	}

	get site() {
		return getString(this, 'site');
	}

	set site(newValue) {
		const oldValue = getString(this, 'site');
		setString(this, 'site', newValue);
		this.dispatchEvent(new CustomEvent('sitechange', { detail: { oldValue, newValue }}));
	}

	static get observedAttributes() {
		return ['site'];
	}
});
