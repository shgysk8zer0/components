import { html } from '@aegisjsproject/parsers/html.js';
import { css } from '@aegisjsproject/parsers/css.js';
import { WEBP as WEBP_MIME, PNG as PNG_MIME, JPEG as JPEG_MIME } from '@shgysk8zer0/consts/mimes.js';
import { WEBP as WEBP_EXT, PNG as PNG_EXT, JPEG as JPEG_EXT } from '@shgysk8zer0/consts/exts.js';
import { createImage, createElement } from '@shgysk8zer0/kazoo/elements.js';

function showMedia(el) {
	if (el.hidden){
		return false;
	} else if (! el.dataset.hasOwnProperty('media')) {
		return true;
	} else {
		return matchMedia(el.dataset.media).matches;
	}
}

function getType(el) {
	switch (el.tagName) {
		case 'IMG':
		case 'VIDEO':
			return 'image';

		default:
			return 'text';
	}
}

function getMediaInfo(el) {
	const { x = 0, y = 0, fill = '#000000', font = '20px sans-serif', lineWidth = 1 } = el.dataset;
	const type = getType(el);
	const [width, height] = type === 'image' ? [el.width, el.height] : [NaN, NaN];
	const text = type === 'text' ? el.textContent.trim() : '';

	return {
		x: Math.max(parseInt(x), 0),
		y: Math.max(parseInt(y), 0),
		width,
		height,
		type,
		text,
		fill,
		font,
		lineWidth: Math.max(parseInt(lineWidth), 1),
	};
}

const template = html`<div part="controls" class="panel overlay absolute bottom full-width">
	<button type="button" id="start" class="btn when-inactive" data-action="start" title="Open Camera"  aria-label="Open Camera">
		<slot name="start-icon">
			<svg width="96" height="96" viewBox="0 0 16 16" fill="currentColor">
				<path fill-rule="evenodd" d="M15.2 2.09L10 5.72V3c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V9.28l5.2 3.63c.33.23.8 0 .8-.41v-10c0-.41-.47-.64-.8-.41z"/>
			</svg>
		</slot>
	</button>
	<button type="button" id="fullscreen" class="btn when-active" part="btn fullscreen-btn" data-action="fullscreen" title="Enter Fullscreen" aria-label="Enter Fullscreen" disabled="">
		<slot name="fullscreen-icon">
			<svg width="84" height="96" viewBox="0 0 14 16" fill="currentColor">
				<path fill-rule="evenodd" d="M13 10h1v3c0 .547-.453 1-1 1h-3v-1h3v-3zM1 10H0v3c0 .547.453 1 1 1h3v-1H1v-3zm0-7h3V2H1c-.547 0-1 .453-1 1v3h1V3zm1 1h10v8H2V4zm2 6h6V6H4v4zm6-8v1h3v3h1V3c0-.547-.453-1-1-1h-3z"/>
			</svg>
		</slot>
	</button>
	<button type="button" id="exit-fullscreen" class="btn when-active" part="btn exit-fullscreen-btn" data-action="exit-fullscreen" title="Leave Fullscreen" aria-label="Exit Fullscreen" disabled="">
		<slot name="exit-fullscreen-icon">
			<svg width="84" height="96" viewBox="0 0 14 16" fill="currentColor">
				<path fill-rule="evenodd" d="M2 4H0V3h2V1h1v2c0 .547-.453 1-1 1zm0 8H0v1h2v2h1v-2c0-.547-.453-1-1-1zm9-2c0 .547-.453 1-1 1H4c-.547 0-1-.453-1-1V6c0-.547.453-1 1-1h6c.547 0 1 .453 1 1v4zM9 7H5v2h4V7zm2 6v2h1v-2h2v-1h-2c-.547 0-1 .453-1 1zm1-10V1h-1v2c0 .547.453 1 1 1h2V3h-2z"/>
			</svg>
		</slot>
	</button>
	<button type="button" id="share" class="btn when-active" part="btn share-btn" data-action="share" title="Share" aria-label="Share" accesskey="s" disabled="">
		<slot name="share-icon">
			<svg width="96" height="96" viewBox="0 0 16 16" fill="currentColor">
				<path d="M5.969 7.969a2.969 2.969 0 1 1-5.938 0 2.969 2.969 0 1 1 5.938 0zm9.968 5a2.969 2.969 0 1 1-5.937 0 2.969 2.969 0 1 1 5.937 0zm0-10a2.969 2.969 0 1 1-5.937 0 2.969 2.969 0 1 1 5.937 0z" overflow="visible"/>
				<path d="M12.625 2.156L2.562 7.031.75 7.938l1.812.906 10.032 5.062.906-1.812-8.22-4.156 8.219-4-.875-1.782z" overflow="visible"/>
			</svg>
		</slot>
	</button>
	<button type="button" id="capture" class="btn when-active" part="btn capture-btn" data-action="capture" title="Capture" aria-label="Capture" accesskey=" ">
		<slot name="capture-icon">
			<svg viewBox="0 0 2 2" fill="currentColor" height="96" width="96" fill="currentColor">
				<circle cx="1" cy="1" r="1"></circle>
			</svg>
		</slot>
	</button>
	<button type="button" id="stop" class="btn when-active" part="btn stop-btn" data-action="stop" title="Close Camera" aria-label="Close Camera" accesskey="x">
		<slot name="stop-icon">
			<svg width="96" height="96" viewBox="0 0 12 16" fill="currentColor">
				<path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/>
			</svg>
		</slot>
	</button>
</div>`;

const settingsTemplate = html`<details id="opts" class="absolute top full-width overlay" part="settings">
	<summary title="Camera Settings" aria-label="Camera Settings">
		<slot name="settings-icon">
			<svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor" role="presentation">
				<path fill-rule="evenodd" d="M4 7H3V2h1v5zm-1 7h1v-3H3v3zm5 0h1V8H8v6zm5 0h1v-2h-1v2zm1-12h-1v6h1V2zM9 2H8v2h1V2zM5 8H2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm5-3H7c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm5 4h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1z"/>
			</svg>
		</slot>
	</summary>
	<form id="camera-settings">
		<datalist id="percents">
			<option label="10%" value="0.1"></option>
			<option label="25%" value="0.25"></option>
			<option label="50%" value=".5"></option>
			<option label="75%" value="0.75"></option>
			<option label="90%" value="0.9"></option>
		</datalist>
		<fieldset class="no-border">
			<legend>Camera Settings Menu</legend>
			<div class="form-group">
				<label for="facingmode" class="input-label block">Camera Facing Mode</label>
				<select name="facingMode" id="facingmode" class="settings-control input block" required="">
					<option label="Front" value="user"></option>
					<option label="Rear" value="environment"></option>
				</select>
			</div>
			<div class="form-group">
				<label for="type" class="input-label block">Output Format</label>
				<select id="type" name="type" class="settings-control input block" required="">
					<option label="JPEG" value="image/jpeg" selected=""></option>
					<option label="PNG" value="image/png"></option>
					<option label="WebP" value="image/webp"></option>
				</select>
			</div>
			<div class="form-group">
				<label for="quality" class="input-label block">Image Quality</label>
				<input type="range" list="percents" name="quality" id="quality" class="settings-control input block" min="0" max="1" value="0.85" step="0.01" required="" />
			</div>
			<div class="form-group">
				<label for="shutter" class="input-label block">Shutter / Flash</label>
				<input type="checkbox" id="shutter" name="shutter" class="settings-control" />
			</div>
		</fieldset>
	</form>
</details>`;

const styles = css`:host {
	box-sizing: border-box;
	display: block;
	isolation: isolate;
	position: relative;
	color-scheme: dark;
}

summary {
	cursor: pointer;
}

input[type="checkbox"] {
	height: 2.3em;
	width: 2.3em;
}

.block {
	display: block;
}

.fixed {
	position: fixed;
}

.absolute {
	position: absolute;
}

.top {
	top: 0;
}

.bottom {
	bottom: 0;
}

.full-width {
	width: 100%;
}

.no-border {
	border: none;
}

.input {
	width: 100%;
	padding: 0.8em 1.4em;
	margin-block: 0.4em;
	box-sizing: border-box;
}

select.input {
	background-color: transparent;
	border-width: 0 0 2px 0;
}

.btn svg {
	height: 64px;
	width: auto;
}

.canvas {
	width: 100%;
	aspect-ratio: 16/9;
	margin: 0;
	padding: 0;
	border: none;
}

.overlay {
	width: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	color: #dadada;
	box-sizing: border-box;
	backdrop-filter: blur(6px);
}

.panel {
	display: flex;
	height: 128px;
	box-sizing: border-box;
	justify-content: space-evenly;
	align-items: center;
	padding: 12px;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 20;
}

#opts {
	height: 65px;
	font-size: 32px;
	padding: 10px;
	height: fit-content;
}

@media (any-pointer: fine) {
	.overaly {
		transition: opacity 300ms ease-in-out;
	}

	:host(:state(--active):not(:hover, :focus-within)) .overlay {
		opacity: 0.2;
	}
}

@media (orientation: portrait) {
	.panel {
		height: 96px;
	}

	.btn svg {
		height: 48px;
		width: 48px;
	}
}

.btn {
	background-color: transparent;
	color: inherit;
	border: none;
	padding: 0;
	cursor: pointer;
}

.btn:disabled {
	display: none;
}

:host(:state(--inactive)) .when-active {
	display: none;
}

:host(:state(--active)) .when-inactive {
	display: none;
}

:host(:state(--portrait)) .canvas {
	aspect-ratio: 9/16;
}`;

class HTMLPhotoBoothElement extends HTMLElement {
	/** @private {ShadowRoot} */
	#shadow;

	/** @private {ElementInternals} */
	#internals;

	/** @private {HTMLSlotElement} */
	#mediaSlot;

	/** @private {boolean} */
	#makesSense = false;

	/** @private {HTMLCanvasElement} */
	#canvas;

	/** @private {HTMLVideoElement} */
	#video;

	/** @private {CanvasRenderingContext2D} */
	#ctx;

	/** @private {MediaStream|null} */
	#stream;

	/** @private {AbortController} */
	#controller;

	/** @private {MediaQueryList} */
	#mediaQuery;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#internals = this.attachInternals();
		this.#internals.states.add('--inactive');
		this.#canvas = document.createElement('canvas');
		this.#video = document.createElement('video');
		this.#mediaSlot = document.createElement('slot');
		this.#ctx = this.#canvas.getContext('2d');
		this.#canvas.part.add('preview');
		this.#canvas.classList.add('canvas');
		this.#video.hidden = true;
		this.#stream = null;
		this.#mediaSlot.hidden = true;
		this.#mediaSlot.name = 'media';
		this.#mediaQuery = matchMedia('(orientation: landscape');
	}

	connectedCallback() {
		this.#controller = new AbortController();

		const controls = template.cloneNode(true);
		const settings = settingsTemplate.cloneNode(true);
		const normalhandler = ({ target }) => this[target.name] = target.value;
		const checkboxHandler = ({ target }) => this[target.name] = target.checked;

		settings.querySelectorAll('.settings-control[name]').forEach(control => {
			if (control.tagName === 'INPUT' && control.type === 'checkbox') {
				control.checked = this[control.name];
				control.addEventListener('change', checkboxHandler);
			} else {
				control.value = this[control.name];
				control.addEventListener('change', normalhandler);
			}
		});

		controls.querySelector('#capture').addEventListener('click', () => {
			if (this.shutter) {
				this.#canvas.animate([
					{ filter: 'none' },
					{ filter: 'brightness(10)' },
					{ filter: 'none' },
				], {
					duration: 200,
					easing: 'ease-in-out',
				});
			}
			this.saveAs(`capture-${new Date().toISOString()}${this.ext}`).catch(alert);
		});

		controls.querySelector('#start').addEventListener('click', () => this.start().catch(alert));
		controls.querySelector('#stop').addEventListener('click', () => this.stop());
		controls.querySelector('#fullscreen').addEventListener('click', () => this.requestFullscreen());

		this.ownerDocument.addEventListener('fullscreenchange', () => {
			if (this.isSameNode(this.ownerDocument.fullscreenElement)) {
				this.#shadow.getElementById('exit-fullscreen').disabled = false;
				this.#shadow.getElementById('fullscreen').disabled = true;
			} else {
				this.#shadow.getElementById('exit-fullscreen').disabled = true;
				this.#shadow.getElementById('fullscreen').disabled = false;
			}
		}, { signal: this.#controller.signal });

		controls.querySelector('#exit-fullscreen').addEventListener('click', () => {
			if (this.ownerDocument.fullscreenElement.isSameNode(this)) {
				this.ownerDocument.exitFullscreen();
			}
		});

		this.#mediaQuery.addEventListener('change', () => {
			if (this.active)  {
				this.start();
			}
		});

		controls.querySelector('#fullscreen').disabled = false;

		if (navigator.share instanceof Function) {
			controls.querySelector('#share').addEventListener('click', () => this.share());
			controls.querySelector('#share').disabled = false;
		} else {
			controls.querySelector('#share').disabled = true;
		}

		this.#shadow.replaceChildren(settings, this.#canvas, this.#video, this.#mediaSlot, controls);
		this.#shadow.adoptedStyleSheets = [styles];
		this.dispatchEvent(new Event('connected'));
	}

	disconnectedCallback() {
		if (this.#controller instanceof AbortController && !this.#controller.signal.aborted) {
			this.#controller.abort(`<${this.tagName}> was disconnected.`);
		}

		this.stop();
	}

	attributeChangedCallback(name) {
		switch (name) {
			case 'facingmode':
				if (this.active) {
					this.start();
				}
				break;
		}
	}

	get active() {
		return this.#stream instanceof MediaStream;
	}

	get mediaElements() {
		return this.#mediaSlot.assignedElements();
	}

	get orientation() {
		const aspectRatio = this.aspectRatio;

		if (Number.isNaN(aspectRatio)) {
			return 'unknown';
		} else if (aspectRatio === 1) {
			return 'square';
		} else if (aspectRatio > 1) {
			return 'landscape';
		} else {
			return 'portrait';
		}
	}

	get aspectRatio() {
		if (this.active) {
			return this.#video.videoWidth / this.#video.videoHeight;
		} else {
			return NaN;
		}
	}

	get height() {
		if (this.active) {
			return this.#video.videoHeight;
		} else {
			return NaN;
		}
	}

	get width() {
		if (this.active) {
			return this.#video.videoWidth;
		} else {
			return NaN;
		}
	}

	get facingMode() {
		if (this.hasAttribute('facingmode')) {
			return this.getAttribute('facingmode');
		} else {
			return 'user';
		}
	}

	set facingMode(val) {
		if (typeof val !== 'string' || val.length === 0) {
			this.removeAttribute('facingmode');
		} else if (!['user', 'environment'].includes(val)) {
			throw new TypeError(`Invalid option for facing mode: "${val}."`);
		} else {
			this.setAttribute('facingmode', val);
		}
	}

	get frontFacing() {
		return this.facingMode === 'user';
	}

	set frontFacing(val) {
		this.facingMode = val ? 'user' : 'environment';
	}

	get whenConnected() {
		const { promise, resolve } = Promise.withResolvers();

		if (this.isConnected) {
			resolve();
		} else {
			this.addEventListener('connected', () => resolve(), { once: true });
		}

		return promise;
	}

	get whenActive() {
		const { resolve, promise } = Promise.withResolvers();

		if (this.active) {
			resolve();
		} else {
			this.addEventListener('start', () => resolve(), { once: true });
		}

		return promise;
	}

	get quality() {
		if (this.hasAttribute('quality')) {
			return Math.max(Math.min(parseFloat(this.getAttribute('quality')), 1), 0);
		} else {
			return 0.85;
		}
	}

	get shutter() {
		return this.hasAttribute('shutter');
	}

	set shutter(val) {
		this.toggleAttribute('shutter', val);
	}

	set quality(val) {
		if (typeof val === 'string') {
			this.quality = parseFloat(val);
		} else if (typeof val !== 'number' || Number.isNaN(val)) {
			throw new TypeError('Quality must be a number.');
		} else if (val < 0 || val > 1) {
			throw new RangeError('Quality must be between 0 and 1.');
		} else {
			this.setAttribute('quality', val.toString());
		}
	}

	get type() {
		if (this.hasAttribute('type')) {
			return this.getAttribute('type') ?? PNG_MIME;
		} else {
			return PNG_MIME;
		}
	}

	set type(val) {
		if (typeof val === 'string' && val.length !== 0) {
			this.setAttribute('type', val);
		} else {
			this.removeAttribute('type');
		}
	}

	get ext() {
		switch (this.type) {
			case PNG_MIME:
				return PNG_EXT[0];

			case WEBP_MIME:
				return WEBP_EXT[0];

			case JPEG_MIME:
				// ['.jpeg', '.jpg']
				return JPEG_EXT[1];

			default:
				return PNG_EXT[0];
		}
	}

	async start({ signal } = {}) {
		if (this.active) {
			this.stop({ exitFullscreen: false });
		}

		await this.whenConnected;

		this.#stream = await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: this.facingMode,
				width: {
					min: 1,
					ideal: 1280,
				},
				height: {
					min: 1,
					ideal: 720,
				},
			}
		});

		this.#video.srcObject = this.#stream;

		this.#video.addEventListener('canplay', () => {
			this.#video.play();
			this.#ctx.canvas.height = this.#video.videoHeight;
			this.#ctx.canvas.width = this.#video.videoWidth;
			this.#internals.states.delete('--inactive');
			this.#internals.states.add('--active');
			this.#internals.states.add('--' + this.orientation);
			this.#renderFrame({ signal });
			this.#shadow.getElementById('start').disabled = true;
			this.dispatchEvent(new Event('start'));
		}, { once: true });
	}

	stop({ exitFullscreen = true } = {}) {
		if (this.#stream instanceof MediaStream) {
			this.#video.pause();
			this.#stream.getTracks().forEach(track => track.stop());
			this.#stream = null;
			this.#ctx.reset();
			this.#stream = null;
			this.dispatchEvent(new Event('stop'));
			this.#internals.states.clear();
			this.#internals.states.add('--inactive');
			this.#shadow.getElementById('start').disabled = false;

			if (exitFullscreen && this.isSameNode(document.fullscreenElement)) {
				this.ownerDocument.exitFullscreen();
			}
		}
	}

	clearMedia() {
		this.mediaElements.forEach(el => el.remove());
	}

	async addImage(src, {
		x,
		y,
		width,
		height,
		media,
		alt = 'Canvas image',
		crossOrigin = 'anonymous',
		referrerPolicy = 'no-referrer',
	} = {}) {
		const img = createImage(src, {
			width, height, alt, crossOrigin, referrerPolicy,
			dataset: { x, y },
			slot: 'media',
			loading: 'eager',
		});

		await img.decode();

		if (typeof width !== 'number') {
			img.width = img.naturalWidth;
		}

		if (typeof height !== 'number') {
			img.height = img.naturalHeight;
		}

		if (typeof media === 'string') {
			img.dataset.media = media;
		} else if (media instanceof MediaQueryList) {
			img.dataset.media = media.media;
		}

		this.append(img);
		return img;
	}

	async addFont(fontFace) {
		if (! (fontFace instanceof FontFace)) {
			throw new TypeError('Not a FontFace and cannot be loaded.');
		} else if (this.ownerDocument.fonts.status === 'loading') {
			await this.ownerDocument.fonts.ready;
		}

		if (this.ownerDocument.fonts.has(fontFace)) {
			return true;
		} else {
			try {
				document.fonts.add(await fontFace.load());
				return this.ownerDocument.fonts.has(fontFace);
			} catch {
				return false;
			}
		}
	}

	async addText(text, {
		fill = '#000000',
		font,
		x,
		y,
		media,
	} = {}) {
		const el = createElement('span', {
			text,
			dataset: { fill, font, x, y },
			slot: 'media',
		});

		if (typeof media === 'string') {
			el.dataset.media = media;
		} else if (media instanceof MediaQueryList) {
			el.dataset.media = media.media;
		}

		this.append(el);
		return el;
	}

	async toFile(filename) {
		if (typeof filename !== 'string' || filename.length === 0) {
			throw new TypeError('Filename must be a non-empty string.');
		} else {
			const blob = await this.toBlob();
			return new File([await blob.arrayBuffer()], filename, { type: blob.type });
		}
	}

	async toBlob() {
		const { promise, resolve, reject } = Promise.withResolvers();

		this.whenConnected.then(() => {
			try {
				this.#canvas.toBlob(resolve, this.type, this.quality);
			} catch (err) {
				reject(err);
			}
		});

		return await promise;
	}

	async toBlobURL() {
		return URL.createObjectURL(await this.toBlob());
	}

	async toDataURL() {
		const { promise, resolve, reject } = Promise.withResolvers();

		this.whenConnected.then(() => {
			try {
				resolve(this.#canvas.toDataURL(this.type, this.quality));
			} catch (err) {
				reject(err);
			}
		});

		return await promise;
	}

	async toImage({ alt = 'Captured image', height, width, classList } = {}) {
		const img = document.createElement('img');
		img.src = await this.toDataURL();
		img.alt = alt;

		if (typeof height === 'number') {
			img.height = height;
		}

		if (typeof width === 'number') {
			img.width = width;
		}

		if (Array.isArray(classList)) {
			img.classList.add(...classList);
		}

		await img.decode();
		return img;
	}

	async share() {
		if (navigator.share instanceof Function) {
			const { title, text, url } = this.dataset;

			return await navigator.share({
				title,
				text,
				url: typeof url === 'string' ? new URL(url, location.href).href : undefined,
				files: [await this.toFile('capture' + this.ext)]
			});
		} else {
			return false;
		}
	}

	async saveAs(filename) {
		if (this.active) {
			const a = document.createElement('a');
			a.href = await this.toBlobURL();
			a.download = filename;
			a.hidden = true;
			this.ownerDocument.body.append(a);

			setTimeout(() => {
				URL.revokeObjectURL(a.href);
				a.remove();
			}, 200);

			a.click();
		}
	}

	#renderFrame({ signal } = {}) {
		const assignedMedia = this.mediaElements;
		this.#ctx.scale(-1, 1);
		this.#ctx.drawImage(this.#video, 0, 0, this.#canvas.width, this.#canvas.height);

		if (assignedMedia.length !== 0) {
			this.#ctx.scale(1, 1);

			assignedMedia.filter(showMedia).forEach(el => {
				try {
					const { x, y, width, height, type, text, font, fill, lineWidth } = getMediaInfo(el);

					switch (type) {
						case 'image':
							this.#ctx.drawImage(el, x, y, width, height);
							break;

						case 'text':
							this.#ctx.font = font;
							this.#ctx.fillStyle = fill;
							this.#ctx.lineWidth = lineWidth;
							this.#ctx.fillText(text, x, y);
							break;

						default:
							throw new TypeError(`Unknown type to render: "${type ?? 'unknown'}".`);
					}
				} catch (err) {
					console.error(err);
				}
			});

		}

		if (signal instanceof AbortSignal && signal.aborted) {
			this.stop();
		} else {
			requestAnimationFrame(() => this.#renderFrame({ signal }));
		}
	}

	static get observedAttributes() {
		return ['facingmode'];
	}
}

customElements.define('photo-booth', HTMLPhotoBoothElement);
