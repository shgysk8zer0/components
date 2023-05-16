import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { loadStylesheet } from '@shgysk8zer0/kazoo/loader.js';
import { createElement, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { meta } from './import.meta.js';

const protectedData = new WeakMap();

registerCustomElement('toast-message', class HTMLToastMessageElement extends HTMLElement {
	constructor(message = null) {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		const internals = this.attachInternals();
		protectedData.set(this, { shadow, internals });

		shadow.append(
			createElement('div', {
				classList: ['backdrop'],
				part: ['backdrop'],
			}),
			createElement('div', {
				classList: ['container'],
				part: ['container'],
				children: [
					createElement('button', {
						type: 'button',
						id: 'close-toast-button',
						part: ['close-btn'],
						title: 'Close',
						events: { click: () => this.close() },
						children: [
							createSlot('close-icon', {
								children: [
									createXIcon({ size: 16, fill: 'currentColor', classList: ['icon'] })
								]
							})
						]
					}),
					createSlot('content'),
				]
			})
		);

		this.dispatchEvent(new Event('ready'));

		Promise.all([
			loadStylesheet(meta.resolve('./toast-message.css'), { parent: shadow }),
			this.whenConnected,
		]).then(() => {
			this.hidden = ! this.open;

			if (typeof message === 'string') {
				this.text = message;
			} else if (message instanceof HTMLElement) {
				this.contentElement = message;
			}
		});
	}

	connectedCallback() {
		this.dispatchEvent(new Event('connected'));
		const { internals } = protectedData.get(this);
		internals.role = 'dialog';
	}

	async attributeChangedCallback(attr, oldVal, newVal) {
		switch(attr) {
			case 'open':
				if (newVal !== null) {
					await this.show();
					this.dispatchEvent(new Event('open'));
					// @TODO: make other elements `inert`
				} else {
					await this.close();
					this.dispatchEvent(new Event('close'));
				}
				break;

			case 'color':
				if (newVal !== null) {
					this.style.setProperty('--toast-color', newVal);
				} else {
					this.style.removeProperty('--toast-color');
				}
				break;

			case 'background':
				if (newVal !== null) {
					this.style.setProperty('--toast-background', newVal);
				} else {
					this.style.removeProperty('--toast-background');
				}
				break;

			case 'height':
				if (newVal !== null) {
					this.style.setProperty('--toast-height', newVal);
				} else {
					this.style.removeProperty('--toast-height');
				}
				break;
		}
	}

	get open() {
		return this.hasAttribute('open');
	}

	set open(open) {
		this.toggleAttribute('open', open);
	}

	get ready() {
		return new Promise(resolve => {
			const { shadow } = protectedData.get(this);

			if (shadow.childElementCount < 2) {
				this.addEventListener('ready', () => resolve(), { once: true });
			} else {
				resolve();
			}
		});
	}

	get whenConnected() {
		return new Promise(resolve => {
			if (this.isConnected) {
				resolve();
			} else {
				this.addEventListener('connected', () => resolve(), { once: true });
			}
		});
	}

	set text(text) {
		const el = document.createElement('div');
		el.textContent = text;
		this.contentElement = el;
	}

	get backdrop() {
		return this.hasAttribute('backdrop');
	}

	set backdrop(val) {
		this.toggleAttribute('backdrop', val);
	}

	get timer() {
		return parseInt(this.getAttribute('timer'));
	}

	set timer(val) {
		this.setAttribute('timer', val);
	}

	get color() {
		return this.getAttribute('color');
	}

	set color(color) {
		this.setAttribute('color', color);
	}

	get background() {
		return this.getAttribute('background');
	}

	set background(color) {
		this.setAttribute('background', color);
	}

	get duration() {
		return this.hasAttribute('duration') ? parseInt(this.getAttribute('duration')) : 400;
	}

	set duration(duration) {
		if (Number.isInteger(duration)) {
			this.setAttribute('duration', duration);
		} else {
			throw new Error('Duration must be an integer');
		}
	}

	get contentSlot() {
		return this.shadowRoot.querySelector('slot[name="content"]');
	}

	get contentNodes() {
		return this.contentSlot.assignedNodes();
	}

	set contentNodes(nodes) {
		if (Array.isArray(nodes)) {
			nodes.forEach(node => node.slot = 'content');
			this.replaceChildren(...nodes);
		} else {
			throw new Error('contentNodes must be an array of Nodes');
		}
	}

	set contentElement(el) {
		el.slot = 'content';
		this.replaceChildren(el);
	}

	get height() {
		return this.getBoundingClientRect().height;
	}

	async show() {
		await this.whenConnected;
		await this.ready;
		this.hidden = false;
		const timer = this.timer;
		const container = this.shadowRoot.querySelector('.container');
		const showBackdrop = this.backdrop;
		const anim = container.animate([{
			bottom: `-${this.height}px`,
			opacity: 0,
		}, {
			bottom: '0',
			opacity: 1,
		}], {
			duration: this.duration,
			easing: 'ease-in-out',
			fill: 'both',
		});

		this.open = true;

		if (showBackdrop) {
			this.shadowRoot.querySelector('.backdrop').hidden = false;
		}
		await anim.finished;

		if (! Number.isNaN(timer)) {
			setTimeout(() => this.close(), timer * 1000);
		}

		return this;
	}

	async close() {
		await this.ready;
		const container = this.shadowRoot.querySelector('.container');
		const anim = container.animate([{
			bottom: `-${this.height}px`,
			opacity: 0,
		}, {
			bottom: '0',
			opacity: 1,
		}], {
			duration: this.duration,
			easing: 'ease-in-out',
			fill: 'both',
			direction: 'reverse',
		});

		await anim.finished;
		this.open = false;
		this.hidden = true;
		if (this.backdrop) {
			this.shadowRoot.querySelector('.backdrop').hidden = true;
		}
		return this;
	}

	get opened() {
		return new Promise(resolve => {
			if (this.open === false) {
				this.addEventListener('open', () => resolve(this), {once: true});
			} else {
				resolve(this);
			}
		});
	}

	get closed() {
		return new Promise(resolve => {
			if (this.open === true) {
				this.addEventListener('close', () => resolve(this), {once: true});
			} else {
				resolve(this);
			}
		});
	}

	static get observedAttributes() {
		return [
			'open',
			'color',
			'background',
			'height',
		];
	}

	static async toast(text, {
		duration   = NaN,
		color      = null,
		background = null,
	} = {}) {
		const toast = new HTMLToastMessageElement(text);

		if (Number.isInteger(duration)) {
			toast.duration = duration;
		}

		if (typeof color === 'string') {
			toast.color = color;
		}

		if (typeof background === 'string') {
			toast.background = background;
		}

		document.body.append(toast);
		await toast.show();
		await toast.closed;
		toast.remove();
	}
});
