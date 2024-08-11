import { createImage } from '@shgysk8zer0/kazoo/elements.js';
import { css } from '@aegisjsproject/parsers/css.js';

const ALIGN = 'start';
const TYPE = 'inline';
const BEHAVIOR = 'smooth';

const styles = css`
	:host {
		isolation: isolate;
		contain: strict;
		overflow: hidden;
	}

	:host([behavior="smooth"]) {
		--scroll-behavior: smooth;
	}

	:host([behavior="auto"]), :host([behavior="instant"]) {
		--scroll-behavior: auto;
	}

	:host([type="inline"]) {
		--snap-type: inline;
		--flex-dir: row;
	}

	:host([type="block"]) {
		--snap-type: block;
		--flex-dir: column;
	}

	:host([align="center"]) {
		--snap-align: center;
	}

	:host([align="start"]) {
		--snap-align: start;
	}

	:host([align="end"]) {
		--snap-align: end;
	}

	:host(:popover-open) {
		padding: 0;
		border: none;
	}

	:host(:not([hidden]):not([popover])) {
		display: inline-block;
	}

	.container {
		display: flex;
		gap: 0.4rem;
		scrollbar-gutter: stable both-edges;
		scrollbar-width: thin;
		width: 100%;
		height: 100%;
		overflow: auto;
		flex-direction: var(--flex-dir, row);
		scroll-snap-type: var(--snap-type, ${TYPE}) mandatory;
		scroll-behavior: var(--scroll-behavior, ${BEHAVIOR});
	}

	::slotted(*) {
		scroll-snap-align: var(--snap-align, ${ALIGN});
		display: inline-block;
		overflow: auto;
		flex-basis: 1fr;
		flex-grow: 1;
		flex-shrink: 0;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		object-position: center;
	}

	@media (prefers-reduced-motion: reduce) {
		:host(:not([behavior])) {
			--scroll-behavior: auto;
		}
	}
`;

customElements.define('scroll-snap', class HTMLScrollSnapElement extends HTMLElement {
	#shadow;
	#container;
	#slot;
	#current = null;
	#observer;
	#updateTimeout = NaN;
	#controller;
	#skipNextUpdate = false;
	#connected = Promise.withResolvers();
	static #prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

	constructor() {
		super();

		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#container = document.createElement('div');
		this.#slot = document.createElement('slot');
		this.#observer = new IntersectionObserver(this.#updateCurrent.bind(this), { root: this });
		this.#container.part.add('container');
		this.#container.classList.add('container');
		this.#shadow.adoptedStyleSheets = [styles];
		this.#container.append(this.#slot);
		this.#shadow.append(this.#container);
	}

	connectedCallback() {
		this.#controller = new AbortController();
		this.#slot.assignedElements().forEach(el => this.#observer.observe(el));
		this.addEventListener('click', this.next.bind(this), { passive: true, signal: this.#controller.signal });
		this.#slot.addEventListener('slotchange', this.#slotChangeHandler.bind(this), { signal: this.#controller.signal });
		this.#connected.resolve(this);
	}

	disconnectedCallback() {
		this.#controller.abort();
		this.#observer.disconnect();
		this.#connected = Promise.withResolvers();
	}

	get align() {
		return this.getAttribute('align') ?? ALIGN;
	}

	set align(val) {
		if (typeof val === 'string' && val.length !== 0) {
			this.setAttribute('align', val);
		} else {
			this.removeAttribute('align');
		}
	}

	get behavior() {
		if (this.hasAttribute('behavior')) {
			return this.getAttribute('behavior');
		} else {
			return HTMLScrollSnapElement.#prefersReducedMotion.matches ? 'instant' : 'smooth';
		}
	}

	set behavior(val) {
		if (typeof val !== 'string' || val.length === 0) {
			this.removeAttribute('behavior');
		} else if (! ['auto', 'smooth', 'instant'].includes(val)) {
			throw new TypeError(`Invalid value for scroll behavior: ${val}.`);
		} else {
			this.setAttribute('behavior', val);
		}
	}

	get current() {
		return this.#current;
	}

	get nextElement() {
		if (!(this.#current instanceof Element)) {
			return null;
		} else if (this.#current.nextElementSibling instanceof Element) {
			return this.#current.nextElementSibling;
		} else if (!this.#current.parentElement.firstElementChild.isSameNode(this.#current)) {
			return this.#current.parentElement.firstElementChild;
		} else {
			return null;
		}
	}

	get prefersReducedMotion() {
		return HTMLScrollSnapElement.#prefersReducedMotion.matches;
	}

	get previousElement() {
		if (!(this.#current instanceof Element)) {
			return null;
		} else if (this.#current.previousElementSibling instanceof Element) {
			return this.#current.previousElementSibling;
		} else if (!this.#current.parentElement.lastElementChild.isSameNode(this.#current)) {
			return this.#current.parentElement.lastElementChild;
		} else {
			return null;
		}
	}

	get slotted() {
		return this.#slot.assignedElements();
	}

	get type() {
		return this.getAttribute('type') ?? TYPE;
	}

	set type(val) {
		if (typeof val === 'string' && val.length !== 0) {
			this.setAttribute('type', val);
		} else {
			this.removeAttribute('type');
		}
	}

	get whenConnected() {
		return this.#connected.promise;
	}

	async addImage(src, {
		id,
		width,
		height,
		alt = '',
		loading = 'lazy',
		decoding = 'async',
		fetchPriority = 'low',
		crossOrigin = 'anonymous',
		referrerPolicy = 'no-referrer',
		classList = null,
	} = {}) {
		if (src instanceof HTMLImageElement) {
			this.append(src.cloneNode());
		} else if (typeof src !== 'string' && ! (src instanceof URL)) {
			throw new TypeError('Image source must be a URL or string.');
		} else {
			const img = createImage(src, { width, height, alt, id, classList, loading, decoding, fetchPriority, crossOrigin, referrerPolicy });

			this.append(img);
			await img.decode();
			return img;
		}
	}

	next() {
		this.#scrollTo(this.nextElement);
	}

	prev() {
		this.#scrollTo(this.previousElement);
	}

	go(index) {
		if (! Number.isSafeInteger(index)) {
			throw new TypeError('Index must be an integer.');
		} else {
			const item = this.slotted.at(index);

			if (! (item instanceof Element)) {
				throw new RangeError('Invalid index.');
			} else {
				this.#scrollTo(item);
				return item;
			}
		}
	}

	#updateCurrent(records) {
		if (! Number.isNaN(this.#updateTimeout)) {
			clearTimeout(this.#updateTimeout);
			this.#updateTimeout = NaN;
		}

		// Prevents updates mid-scrolling
		this.#updateTimeout = setTimeout(() => {
			if (this.#skipNextUpdate === true) {
				this.#skipNextUpdate = false;
			} else if (document.visibilityState === 'hidden' || records.length === 0) {
				this.#updateTimeout = NaN;
			} else {
				this.#updateTimeout = NaN;

				// Current will mean different things based on `align`
				switch (this.align) {
					case 'start':
						this.#current = records.find(entry => entry.isIntersecting && !entry.target.isSameNode(this.#current))?.target ?? records[0].target;
						break;

					case 'center':
						if (records.length === 1 && records[0].isIntersecting) {
							this.#current = records[0].target;
						} else {
							// Find the element between the first and last visible elements
							const first = records.findIndex(entry => entry.isIntersecting && !entry.target.isSameNode(this.#current));
							const last = records.findLastIndex(entry => entry.isIntersecting && !entry.target.isSameNode(this.#current));

							if (first !== -1 && last !== -1) {
								const middle = Math.round((first + last) / 2);
								this.#current = records[middle].target;
							} else if (first === -1) {
								this.#current = records[last].target;
							} else {
								this.#current = records[first].target;
							}
						}
						break;

					case 'end':
						this.#current = records.findLast(entry => entry.isIntersecting && !entry.target.isSameNode(this.#current))?.target ?? records[0].target;
						break;

					default:
						console.warn(new Error(`Unsupported align value of ${this.align}.`));
				}
			}
		}, 100);
	}

	#slotChangeHandler({ target }) {
		target.assignedElements().forEach(el => this.#observer.observe(el));
	}

	async #scrollTo(child) {
		if (child instanceof Element) {
			await this.#connected.promise;
			child.scrollIntoView({ behavior: this.behavior, [this.type]: this.align });
			this.#current = child;
			// Prevents IntersectionObserver from handling the update
			this.#skipNextUpdate = true;

		}
	}
});
