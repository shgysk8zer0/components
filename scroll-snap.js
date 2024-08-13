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
		align-items: stretch;
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
		const slotted = this.#slot.assignedElements();
		slotted.forEach(el => this.#observer.observe(el));
		this.#slot.addEventListener('slotchange', this.#slotChangeHandler.bind(this), { signal: this.#controller.signal });
		this.#connected.resolve(this);
	}

	disconnectedCallback() {
		this.#controller.abort();
		this.#observer.disconnect();
		this.#connected = Promise.withResolvers();
	}

	get [Symbol.toStringTag]() {
		return 'HTMLScrollSnapElement';
	}

	[Symbol.iterator]() {
		return this.#slot.assignedElements().values();
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
		type, // For `<canvas>` and raw bytes
		quality, // For `<canvas>`
		loading = 'lazy', // Keep separate due to issue lazy-loading from blobs
		...rest
	} = {}) {
		if (src instanceof HTMLImageElement) {
			const img = src.cloneNode();
			this.append(img);
			return img;
		} else if (src instanceof SVGSVGElement) {
			const svg = src.cloneNode(true);
			this.append(svg);
			return svg;
		} else if (src instanceof HTMLCanvasElement) {
			const { promise, resolve, reject } = Promise.withResolvers();

			src.toBlob(blob => {
				if (blob instanceof Blob) {
					resolve(blob);
				} else {
					reject(new Error('Could not convert canvas to blob.'));
				}
			}, { type, quality });

			return this.addImage(await promise, { loading: 'eager', ...rest });
		} else if (src instanceof Request) {
			return this.addImage(await fetch(src), {loading: 'eager',...rest });
		} else if (src instanceof Response) {
			return this.addImage(await src.blob(), { loading: 'eager', ...rest });
		} else if ((src instanceof Uint8Array || src instanceof ArrayBuffer) && typeof type === 'string') {
			return this.addImage(URL.createObjectURL(new Blob([src], { type })), { loading: 'eager', ...rest });
		} else if (src instanceof Blob) {
			return this.addImage(URL.createObjectURL(src), { loading: 'eager', ...rest });
		} else if (typeof src !== 'string' && ! (src instanceof URL)) {
			throw new TypeError('Image source must be a URL or string.');
		} else {
			const img = createImage(src, { loading, ...rest });

			this.append(img);
			await img.decode();
			return img;
		}
	}

	async next() {
		await this.scrollTo(this.nextElement);
	}

	async prev() {
		await this.scrollTo(this.previousElement);
	}

	async go(index) {
		if (! Number.isSafeInteger(index)) {
			throw new TypeError('Index must be an integer.');
		} else {
			const item = this.slotted.at(index);

			if (! (item instanceof Element)) {
				throw new RangeError('Invalid index.');
			} else {
				await this.scrollTo(item);
				return item;
			}
		}
	}

	async scrollTo(child) {
		if (! (child instanceof Element)) {
			throw new TypeError('Cannot scroll to a non-element.');
		} else if (! this.contains(child)) {
			throw new TypeError('Not a child of this element and cannot scroll to it.');
		} else {
			await this.#connected.promise;
			child.scrollIntoView({ behavior: this.behavior, [this.type]: this.align });
			this.#current = child;
			// Prevents IntersectionObserver from handling the update
			this.#skipNextUpdate = true;
		}
	}

	#updateCurrent(records) {
		if (! Number.isNaN(this.#updateTimeout)) {
			clearTimeout(this.#updateTimeout);
			this.#updateTimeout = NaN;
		}

		// Prevents updates mid-scrolling
		this.#updateTimeout = setTimeout(() => {
			this.#updateTimeout = NaN;

			if (this.#skipNextUpdate === true) {
				this.#skipNextUpdate = false;
			} else if (document.visibilityState !== 'hidden' && records.length !== 0) {
				const findCb = this.#findVisible.bind(this);

				// Current will mean different things based on `align`
				switch (this.align) {
					case 'start':
						this.#current = records.find(findCb)?.target ?? records[0].target;
						break;

					case 'center':
						if (records.length === 1 && records[0].isIntersecting) {
							this.#current = records[0].target;
						} else {
							// Find the element between the first and last visible elements
							const first = records.findIndex(findCb);
							const last = records.findLastIndex(findCb);

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
						this.#current = records.findLast(findCb)?.target ?? records[0].target;
						break;

					default:
						console.warn(new Error(`Unsupported align value of ${this.align}.`));
				}
			}
		}, 100);
	}

	#slotChangeHandler() {
		this.#slot.assignedElements().forEach(el => this.#observer.observe(el));
	}

	#findVisible(entry) {
		return entry.isIntersecting && !entry.target.isSameNode(this.#current);
	}

	static create({ align = ALIGN, type = TYPE, behavior, children } = {}) {
		const el = new HTMLScrollSnapElement();
		el.align = align;
		el.type = type;

		if (typeof behavior !== 'undefined') {
			el.behavior = behavior;
		}

		if (Array.isArray(children)) {
			el.append(...children);
		}

		return el;
	}
});
