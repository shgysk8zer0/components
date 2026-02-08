import { createImage } from '@shgysk8zer0/kazoo/elements.js';
import { css } from '@aegisjsproject/parsers/css.js';
import { svg } from '@aegisjsproject/parsers/svg.js';
import { getInt, setInt } from '@shgysk8zer0/kazoo/attrs.js';
import { HTMLCommandTargetElement } from './command-target.js';
// import styles from './scroll-snap.css' with { type: 'css' };

const _between = (min, val, max) => ! (val > max || val < min);

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

	.overlay {
		position: relative;
		z-index: 2;
		display: block;
		width: 100%;
		height: 100%;
	}

	:host(:not(:fullscreen)) .btn.fixed {
		position: fixed;
		z-index: 2;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 5em;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fafafa;
		backdrop-filter: blur(4px);
		border: none;
		padding: 20px;
		opacity: 1;
		transition: opacity 150ms ease-out;
		cursor: pointer;
	}

	.btn.fixed.prev-btn {
		left: 0;
	}

	.btn.fixed.next-btn {
		right: 0;
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

	@media (any-pointer: fine) {
		:host(:not(:hover, :focus-within)) .btn.fixed {
			opacity: 0;
		}
	}
`;

const nextIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="32" part="icon next-icon" viewBox="0 0 8 16" fill="currentColor" role="presentation" aria-hidden="true">
	<path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"/>
</svg>`;

const prevIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="32" part="icon prev-icon" viewBox="0 0 8 16" fill="currentColor" role="presentation" aria-hidden="true">
	<path fill-rule="evenodd" d="M5.5 3L7 4.5 3.25 8 7 11.5 5.5 13l-5-5 5-5z"/>
</svg>`;

customElements.define('scroll-snap', class HTMLScrollSnapElement extends HTMLCommandTargetElement {
	#shadow = this.attachShadow({ mode: 'closed', delegatesFocus: true });
	#internals = this.attachInternals();
	#container;
	#slot;
	#current = null;
	#nextBtn;
	#prevBtn;
	#connected = Promise.withResolvers();
	#controller;
	#interval = NaN;
	static #prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

	constructor() {
		super();
		this.registerCommand('--next', this.next);
		this.registerCommand('--prev', this.prev);
		this.registerCommand('--first', this.scrollToFirst);
		this.registerCommand('--last', this.scrollToLast);
		this.registerCommand('--pause', this.pause);
		this.registerCommand('--play', this.play);
		this.registerCommand('--toggle', ({ target }) => target.paused ? target.play() : target.pause());
		this.registerCommand('--fullscreen', ({ target }) => {
			if (target.isSameNode(document.fullscreenElement)) {
				document.exitFullscreen();
			} else {
				target.requestFullscreen();
			}
		});

		this.#container = document.createElement('div');
		this.#slot = document.createElement('slot');
		this.#container.part.add('container');
		this.#container.classList.add('container');
		this.#nextBtn = document.createElement('button');
		this.#prevBtn = document.createElement('button');
		this.#nextBtn.type = 'button';
		this.#nextBtn.title = 'Next';
		this.#nextBtn.ariaLabel = 'Next';
		this.#nextBtn.append(nextIcon.cloneNode(true));
		this.#nextBtn.classList.add('btn', 'next-btn', 'fixed');
		this.#nextBtn.part.add('btn', 'next-btn');
		this.#nextBtn.command = '--next';
		this.#nextBtn.commandForElement = this;
		this.#prevBtn.command = '--prev';
		this.#prevBtn.commandForElement = this;
		this.#prevBtn.type = 'button';
		this.#prevBtn.title = 'Previous';
		this.#prevBtn.ariaLabel = 'Previous';
		this.#prevBtn.append(prevIcon.cloneNode(true));
		this.#prevBtn.classList.add('btn', 'prev-btn', 'fixed');
		this.#prevBtn.part.add('btn', 'prev-btn');

		this.addEventListener('keydown', event => {
			if ((event.metaKey && event.key !== 'Meta') || (event.ctrlKey && event.key !== 'Control')) {
				switch(event.key) {
					case 'ArrowUp':
					case 'ArrowLeft':
					case '<':
						event.currentTarget.scrollToFirst();
						event.preventDefault();
						break;

					case 'ArrowDown':
					case 'ArrowRight':
					case '>':
						event.currentTarget.scrollToLast();
						event.preventDefault();
						break;
				}
			} else {
				switch(event.key) {
					case 'ArrowDown':
					case 'ArrowRight':
					case '>':
						event.currentTarget.next();
						event.preventDefault();
						break;

					case 'ArrowUp':
					case 'ArrowLeft':
					case '<':
						event.currentTarget.prev();
						event.preventDefault();
						break;

					case '[':
						event.currentTarget.scrollToFirst();
						break;

					case ']':
						event.currentTarget.scrollToLast();
						break;
				}
			}
		});

		this.#shadow.adoptedStyleSheets = [styles];

		this.#container.addEventListener('scrollend', event => {
			// @todo Better handle finding current at edges and handle `align`
			const { scrollLeft, scrollTop } = event.target;
			const slotted = this.#slot.assignedElements();
			const visible = slotted.filter((el) =>
				! el.isSameNode(this.#current)
				&& _between(scrollLeft, el.offsetLeft, scrollLeft + el.offsetWidth)
				&& _between(scrollTop, el.offsetTop, scrollTop + el.offsetHeight)
			);

			if (this.#clearInterval()) {
				this.#setInterval();
			}

			if (visible.length === 1) {
				this.#setCurrent(visible[0]);
			} else if (visible.length !== 0) {
				this.#setCurrent(visible[Math.ceil((visible.length - 1) / 2)]);
			} else if (this.#current instanceof Element) {
				this.#setCurrent(this.#current.nextElementSibling instanceof Element
					? this.#current.nextElementSibling
					: slotted[0]);
			}
		});

		const btnOveraly = document.createElement('div');
		btnOveraly.classList.add('overlay');
		btnOveraly.append(this.#prevBtn, this.#nextBtn);
		this.#container.append(this.#slot);
		this.#shadow.append(this.#container, btnOveraly);
	}

	async attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'delay':
				if (typeof oldVal === 'string') {
					this.pause();
				}

				if (typeof newVal === 'string') {
					await this.play();
				}
		}
	}

	connectedCallback() {
		this.#abort();
		this.#controller = new AbortController();
		this.#current = this.firstElementChild;
		this.#connected.resolve(this);
	}

	disconnectedCallback() {
		this.#abort('Disconnected');
		this.#connected = Promise.withResolvers();

		if (! Number.isNaN(this.#interval)) {
			clearInterval(this.#interval);
			this.#interval = NaN;
		}
	}

	[Symbol.dispose]() {
		this.pause();
		this.inert = true;
	}

	#abort(reason) {
		if (this.#controller instanceof AbortController && ! this.#controller.signal.aborted) {
			this.#controller.abort(reason instanceof Error ? reason : new Error(reason));
			return true;
		} else {
			return false;
		}
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

	get delay() {
		return getInt(this, 'delay');
	}

	set delay(val) {
		setInt(this, 'delay', val, { min: 0 });
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

	get paused() {
		return ! this.#internals.states.has('--playing');
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

	// get #aborted() {
	// 	return this.#signal.aborted;
	// }

	get states() {
		return this.#internals.states;
	}

	get #signal() {
		if (this.#controller instanceof AbortController) {
			return this.#controller.signal;
		} else {
			return AbortSignal.abort('Not connected.');
		}
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

	pause() {
		if (this.#internals.states.has('--playing')) {
			clearInterval(this.#interval);
			this.#interval = NaN;
			this.#internals.states.delete('--playing');
		}
	}

	async play() {
		if (this.hasAttribute('delay') && ! this.#internals.states.has('--playing')) {
			await this.whenConnected;
			this.#interval = setInterval(this.next.bind(this), this.delay);
			this.#internals.states.add('--playing');

			this.#signal.addEventListener('abort', () => {
				this.pause();
			}, { once: true });
		}
	}

	async next() {
		await this.#connected.promise;
		const lastEl = this.#slot.assignedElements().at(-1);

		if (this.#current instanceof Element && this.#current.isSameNode(lastEl)) {
			await this.scrollToFirst();
		} else {
			const { height, width } = this.getBoundingClientRect(this.#current ?? this.#container);

			if (this.type === 'inline') {
				await this.scrollBy({ left: width });
			} else {
				this.scrollBy({ top: height });
			}
		}
	}

	async prev() {
		await this.#connected.promise;
		const firstEl = this.#slot.assignedElements()[0];

		if (this.#current instanceof Element && this.#current.isSameNode(firstEl)) {
			await this.scrollToLast();
		} else {
			const { height = 300, width = 300 } = this.getBoundingClientRect(this.#current);

			if (this.type === 'inline') {
				await this.scrollBy({ left: -width });
			} else {
				this.scrollBy({ top: -height });
			}
		}
	}

	async scrollToFirst() {
		await this.scrollTo(this.type === 'inline' ? { left: 0 } : { top: 0 });
	}

	async scrollToLast() {
		await this.scrollTo(this.type === 'inline' ? { left: this.#container.scrollWidth } : { top: this.#container.scrollHeight });
	}

	async scrollTo({ top = 0, left = 0 }) {
		await this.#connected.promise;

		if (this.#clearInterval()) {
			this.#setInterval();
		}

		this.#container.scrollTo({ top, left, behavior: this.behavior });
	}

	async go(index) {
		if (! Number.isSafeInteger(index)) {
			throw new TypeError('Index must be an integer.');
		} else {
			const item = this.slotted.at(index);

			if (! (item instanceof Element)) {
				throw new RangeError('Invalid index.');
			} else {
				if (this.#clearInterval()) {
					this.#setInterval();
				}

				await this.scrollIntoView(item);
				return item;
			}
		}
	}

	async scrollIntoView(child) {
		if (! (child instanceof Element)) {
			throw new TypeError('Cannot scroll to a non-element.');
		} else if (! this.contains(child)) {
			throw new TypeError('Not a child of this element and cannot scroll to it.');
		} else {
			await this.#connected.promise;

			if (this.#clearInterval()) {
				this.#setInterval();
			}

			child.scrollIntoView({ behavior: this.behavior, [this.type]: this.align });
			this.#setCurrent(child);
		}
	}

	async scrollBy({ top = 0, left = 0 }) {
		await this.#connected.promise;
		const behavior = this.behavior;
		this.#container.scrollBy({ top, left, behavior });
	}

	#clearInterval() {
		if (! Number.isNaN(this.#interval)) {
			clearInterval(this.#interval);
			this.#interval = NaN;
			return true;
		} else {
			return false;
		}
	}

	#setInterval() {
		this.#interval = setInterval(this.next.bind(this), this.delay);
	}

	#setCurrent(el, { direction = 'forwards' } = {}) {
		if (! (el instanceof Element)) {
			throw new TypeError('Cannot set current to a non-element.');
		} else if (! (this.#current instanceof Element) || ! el.isSameNode(this.#current)) {
			this.#current = el;
		} else if (direction === 'forward') {
			this.#setCurrent(this.#current.nextElementSibling ?? this.firstElementChild);
		} else {
			this.#setCurrent(this.firstElementChild);
		}
	}

	static get observedAttributes() {
		return ['delay'];
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
