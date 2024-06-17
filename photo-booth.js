import { html } from '@aegisjsproject/parsers/html.js';
import { css } from '@aegisjsproject/parsers/css.js';
import { WEBP as WEBP_MIME, PNG as PNG_MIME, JPEG as JPEG_MIME } from '@shgysk8zer0/consts/mimes.js';
import { WEBP as WEBP_EXT, PNG as PNG_EXT, JPEG as JPEG_EXT } from '@shgysk8zer0/consts/exts.js';
import { createImage, createElement } from '@shgysk8zer0/kazoo/elements.js';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';

function getDimensions(el) {
	switch (el.tagName.toLowerCase()) {
		case 'img':
		case 'video':
			return [el.width, el.height];

		case 'svg':
			return [el.width.baseVal.value, el.height.baseVal.value];

		default:
			return [NaN, NaN];
	}
}

function showItem(item) {
	if (item.el.hidden) {
		return false;
	} else if (item.media instanceof MediaQueryList) {
		return item.media.matches;
	} else {
		return true;
	}
}

function getType(el) {
	switch (el.tagName.toLowerCase()) {
		case 'svg':
			return 'svg';

		case 'img':
		case 'video':
			return 'image';

		default:
			return 'text';
	}
}

function normalhandler({ target }) {
	this[target.name] = target.value;
}

function checkboxHandler({ target }) {
	this[target.name] = target.checked;
}

const template = html`<details id="opts" class="absolute top full-width overlay" part="settings overlay">
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
			<legend class="visually-hidden">Camera Settings Menu</legend>
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
				<label for="type" class="input-label block">Resolution</label>
				<select id="type" name="resolution" class="settings-control input block" required="">
					<option label="QVGA (320x240)" value="320x240"></option>
					<option label="VGA (640x480)" value="640x480"></option>
					<option label="FWVGA (854x480)" value="854x480"></option>
					<option label="qHD (960x540)" value="960x540"></option>
					<option label="HD (720p) (1280x720)" value="1280x720" selected></option>
					<option label="Full HD (1080p) (1920x1080)" value="1920x1080"></option>
					<option label="QHD (1440p) (2560x1440)" value="2560x1440"></option>
					<option label="4K UHD (2160p) (3840x2160)" value="3840x2160"></option>
				</select>
			</div>
			<div class="form-group">
				<label for="quality" class="input-label block">Image Quality</label>
				<input type="range" list="percents" name="quality" id="quality" class="settings-control input block" min="0" max="1" value="0.85" step="0.01" required="" />
			</div>
			<div class="form-group">
				<label for="delay" class="input-label block">Capture Delay (seconds)</label>
				<input type="number" id="delay" name="delay" class="settings-control input block" min="0" max="9" value="0" step="0.1" />
			</div>
			<div class="form-group">
				<label for="shutter" class="input-label block">Shutter / Flash</label>
				<input type="checkbox" id="shutter" name="shutter" class="settings-control" />
			</div>
			<div class="form-group">
				<label for="mirror" class="input-label block">Mirror</label>
				<input type="checkbox" id="mirror" name="mirror" class="settings-control" />
			</div>
			<div class="form-group">
				<label for="hide-items" class="input-label block">Hide Media/Overlays/Text</label>
				<input type="checkbox" id="hide-items" name="hideItems" class="settings-control" />
			</div>
		</fieldset>
	</form>
</details>
<canvas id="canvas" part="preview" class="when-active canvas"></canvas>
<div part="placeholder" id="placeholder" class="when-inactive placeholder">
	<slot name="placeholder">
		<p>Press the camera / start button on the bottom to open your camera and get started.</p>
	</slot>
</div>
<div part="controls overlay" class="panel overlay absolute bottom full-width">
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
	<button type="button" id="toggle-settings" class="btn" part="btn settings-btn" data-action="toggle-settings" title="Toggle Settings Menu" aria-label="Toggle Settings">
		<slot name="settings-icon">
			<svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor" role="presentation">
				<path fill-rule="evenodd" d="M4 7H3V2h1v5zm-1 7h1v-3H3v3zm5 0h1V8H8v6zm5 0h1v-2h-1v2zm1-12h-1v6h1V2zM9 2H8v2h1V2zM5 8H2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm5-3H7c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm5 4h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1z"/>
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
	<button type="button" id="share" class="btn when-active" part="btn share-btn" data-action="share" title="Share" aria-label="Share" accesskey="s" disabled="">
		<slot name="share-icon">
			<svg width="96" height="96" viewBox="0 0 16 16" fill="currentColor">
				<path d="M5.969 7.969a2.969 2.969 0 1 1-5.938 0 2.969 2.969 0 1 1 5.938 0zm9.968 5a2.969 2.969 0 1 1-5.937 0 2.969 2.969 0 1 1 5.937 0zm0-10a2.969 2.969 0 1 1-5.937 0 2.969 2.969 0 1 1 5.937 0z" overflow="visible"/>
				<path d="M12.625 2.156L2.562 7.031.75 7.938l1.812.906 10.032 5.062.906-1.812-8.22-4.156 8.219-4-.875-1.782z" overflow="visible"/>
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
</div>
<slot name="media" id="media" hidden=""></slot>
<slot name="overlay" id="overlay" hidden=""></slot>
<video id="stream" hidden=""></video>`;

const styles = css`:host {
	box-sizing: border-box;
	display: block;
	isolation: isolate;
	position: relative;
	color-scheme: dark;
	background-color: #232323;
}

summary {
	cursor: pointer;
}

#opts summary {
	list-style: none;
	display: none;
}

#opts summary::marker,
#opts summary::-webkit-details-marker {
  display: none;
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
	padding: 0.5em 0.8em;
	margin-block: 0.4em;
	box-sizing: border-box;
	font-size: inherit;
}

.visually-hidden {
	visibility: hidden;
	display: inline-block;
	width: 0;
	height: 0;
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
	font-size: 24px;
	padding: 10px;
	height: fit-content;
}

#opts[open] {
	height: calc(100% - 128px);
	overflow: auto;
}

#placeholder {
	aspect-ratio: 16/9;
	color: #fefefe;
	padding-block: 60px;
	font-size: 2em;
}

@media (any-pointer: fine) {
	.overlay {
		transition: opacity 300ms ease-in-out;
	}

	:host(:state(--active):not(:hover, :focus-within)) .overlay {
		opacity: 0.2;
	}
}

@media (orientation: portrait) {
	:host(:fullscreen) canvas {
		margin-top: 65px;
	}

	#placeholder {
		aspect-ration: 9/16;
	}

	.panel {
		height: 96px;
	}

	#opts[open] {
		height: calc(100% - 96px);
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

export class HTMLPhotoBoothElement extends HTMLElement {
	/** @private {ShadowRoot} */
	#shadow;

	/** @private {ElementInternals} */
	#internals;

	/** @private {HTMLSlotElement} */
	#mediaSlot;

	/** @private {HTMLSlotElement} */
	#overlaySlot;

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
	#mediaQuery = matchMedia('(orientation: landscape');

	/** @private {Map} */
	#media = new Map();

	/** @private {Map} */
	#overlays = new Map();

	/** @private {Map<Element,object>} */
	#blobImages = new Map();

	/** @private {WakeLockSentinel|null} */
	#wakeLock = null;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();
		this.#internals.states.add('--inactive');
	}

	connectedCallback() {
		this.#controller = new AbortController();
		const signal = this.#controller.signal;
		const passive = true;

		this.#shadow.adoptedStyleSheets = [styles];
		this.#shadow.replaceChildren(template.cloneNode(true));
		this.#shadow.querySelector('form').addEventListener('submit', event => {
			event.preventDefault();
			event.target.closest('details').open = false;
		});

		this.#mediaSlot = this.#shadow.getElementById('media');
		this.#overlaySlot = this.#shadow.getElementById('overlay');
		this.#canvas = this.#shadow.getElementById('canvas');
		this.#video = this.#shadow.getElementById('stream');
		this.#ctx = this.#canvas.getContext('2d');
		this.#mediaSlot.addEventListener('slotchange', this.refreshMedia.bind(this), { signal, passive });
		this.#overlaySlot.addEventListener('slotchange', this.refreshOverlays.bind(this), { signal, passive });

		this.#shadow.getElementById('toggle-settings').addEventListener('click', () => {
			const opts = this.#shadow.getElementById('opts');
			opts.open = !opts.open;
		});

		this.#shadow.querySelectorAll('.settings-control[name]').forEach(control => {
			if (control.tagName === 'INPUT' && control.type === 'checkbox') {
				control.checked = this[control.name];
				control.addEventListener('change', checkboxHandler.bind(this), { signal, passive });
			} else {
				control.value = this[control.name];
				control.addEventListener('change', normalhandler.bind(this), { signal, passive });
			}
		});

		this.#shadow.getElementById('capture').addEventListener('click', async () => {
			await this.#waitForDelay();
			this.dispatchEvent(new Event('beforecapture'));
			await this.#snapShutter();
			await this.saveAs(`capture-${new Date().toISOString()}${this.ext}`);

			this.dispatchEvent(new Event('aftercapture'));
		}, { signal, passive });

		this.#shadow.getElementById('start').addEventListener('click', this.start.bind(this), { signal, passive });
		this.#shadow.getElementById('stop').addEventListener('click', this.stop.bind(this), { signal, passive });
		this.#shadow.getElementById('fullscreen').addEventListener('click', this.requestFullscreen.bind(this), { signal, passive });

		this.ownerDocument.addEventListener('fullscreenchange', () => {
			if (this.isSameNode(this.ownerDocument.fullscreenElement)) {
				this.#shadow.getElementById('exit-fullscreen').disabled = false;
				this.#shadow.getElementById('fullscreen').disabled = true;
			} else {
				this.#shadow.getElementById('exit-fullscreen').disabled = true;
				this.#shadow.getElementById('fullscreen').disabled = false;
			}
		}, { signal, passive });

		this.#shadow.getElementById('exit-fullscreen').addEventListener('click', () => {
			if (this.ownerDocument.fullscreenElement.isSameNode(this)) {
				this.ownerDocument.exitFullscreen();
			}
		}, { signal, passive });

		this.#mediaQuery.addEventListener('change', () => {
			if (this.active) {
				this.start();
			}
		}, { signal, passive });

		this.#shadow.getElementById('fullscreen').disabled = false;

		if (navigator.share instanceof Function) {
			this.#shadow.getElementById('share').addEventListener('click', async () => {
				await this.#waitForDelay();
				this.dispatchEvent(new Event('beforecapture'));
				await this.#snapShutter();
				await this.share();
				this.dispatchEvent(new Event('aftercapture'));
			}, { signal, passive });

			this.#shadow.getElementById('share').disabled = false;
		} else {
			this.#shadow.getElementById('share').disabled = true;
		}

		this.dispatchEvent(new Event('connected'));
	}

	disconnectedCallback() {
		if (this.#controller instanceof AbortController && !this.#controller.signal.aborted) {
			this.#controller.abort(`<${this.tagName}> was disconnected.`);
		}

		if (this.#blobImages.size !== 0) {
			this.#blobImages.value().forEach(img => URL.revokeObjectURL(img.src));
			this.#blobImages.clear();
		}

		this.#media.clear();
		this.#overlays.clear();
		this.stop();
	}

	attributeChangedCallback(name) {
		switch (name) {
			case 'facingmode':
			case 'resolution':
				if (this.active) {
					this.start();
				}
				break;
		}
	}

	get abortSignal() {
		if (this.#controller instanceof AbortController) {
			return this.#controller.signal;
		} else {
			return undefined;
		}
	}

	get active() {
		return this.#stream instanceof MediaStream;
	}

	get delay() {
		if (this.hasAttribute('delay')) {
			return Math.min(Math.max(parseFloat(this.getAttribute('delay'), 0)), 9);
		} else {
			return 0;
		}
	}

	set delay(val) {
		if (typeof val === 'string') {
			this.delay = parseFloat(val);
		} else if (Number.isFinite(val) && val > 0) {
			this.setAttribute('delay', val.toString());
		} else {
			this.removeAttribute('delay');
		}
	}

	get mediaElements() {
		return this.#mediaSlot.assignedElements();
	}

	get overlayElements() {
		return this.#overlaySlot.assignedElements();
	}

	get overlayItems() {
		return [...this.#overlays.values()].filter(item => showItem(item));
	}

	get mediaItems() {
		return [...this.#media.values()].filter(item => showItem(item));
	}

	get orientation() {
		const aspectRatio = this.aspectRatio;

		if (! Number.isFinite(aspectRatio)) {
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

	get nativeHeight() {
		if (this.active) {
			return this.#video.videoHeight;
		} else {
			return NaN;
		}
	}

	get nativeWidth() {
		if (this.active) {
			return this.#video.videoWidth;
		} else {
			return NaN;
		}
	}

	get resolution() {
		if (this.hasAttribute('resolution')) {
			return this.getAttribute('resolution');
		} else {
			return '1280x720';
		}
	}

	set resolution(val) {
		if (typeof val !== 'string' || ! val.includes('x')) {
			throw new TypeError('Invalid resolution.');
		} else if (val !== this.resolution) {
			const [idealWidth, idealHeight] = val.split('x').map(n => parseInt(n));

			if (! (Number.isSafeInteger(idealHeight) && Number.isSafeInteger(idealWidth) && idealHeight > 0 && idealWidth > 0)) {
				throw new DOMException('Error parsing given resolution.');
			} else {
				this.setAttribute('resolution', `${idealWidth}x${idealHeight}`);
			}
		}
	}

	set idealWidth(val) {
		if (typeof val === 'string') {
			this.idealWidth = parseInt(val);
		} else if (typeof val !== 'number' || !Number.isSafeInteger(val)) {
			throw new TypeError('Ideal width must be an integer.');
		} else if (val < 0) {
			throw new TypeError('Ideal width must be a positive integer.');
		} else {
			this.setAttribute('idealwidth', val.toString());
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

	get mirror() {
		return this.hasAttribute('mirror');
	}

	set mirror(val) {
		this.toggleAttribute('mirror', val);
	}

	get hideItems() {
		return this.hasAttribute('hideitems');
	}

	set hideItems(val) {
		this.toggleAttribute('hideitems', val);
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

	get cameraConfig() {
		const { resolution, facingMode } = this;
		const [idealWidth, idealHeight] = resolution.split('x').map(n => parseInt(n));

		return {
			video: {
				facingMode: facingMode,
				width: {
					min: 1,
					ideal: idealWidth,
				},
				height: {
					min: 1,
					ideal: idealHeight,
				},
			}
		};
	}

	refreshMedia() {
		this.#media = new Map(this.#mediaSlot.assignedElements().map(el => [el, this.#getMediaInfo(el)]));
	}

	refreshOverlays() {
		this.#overlays = new Map(this.#overlaySlot.assignedNodes().map(el => {
			const { x = 0, y = 0, height = 0, width = 0, fill = '#000000', media } = el.dataset;

			return [el, Object.freeze({
				type: 'overlay',
				x: parseInt(x),
				y: parseInt(y),
				height: parseInt(height),
				width: parseInt(width),
				fill,
				el,
				media: typeof media === 'string' ? matchMedia(media) : null,
			})];
		}));
	}

	async start({ signal } = {}) {
		if (this.active) {
			this.stop({ exitFullscreen: false });
		}

		await this.whenConnected;

		this.#stream = await navigator.mediaDevices.getUserMedia(this.cameraConfig);
		this.#requestWakeLock();

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
			this.requestFullscreen();
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

			if ('wakeLock' in navigator && this.#wakeLock instanceof globalThis.WakeLockSentinel && !this.#wakeLock.released) {
				this.#wakeLock.release();
				this.#wakeLock = null;
			}

			if (exitFullscreen && this.isSameNode(document.fullscreenElement)) {
				this.ownerDocument.exitFullscreen();
			}
		}
	}

	clearMedia() {
		this.mediaElements.forEach(el => el.remove());
	}

	clearOverlays() {
		this.#overlaySlot.assignedElements().forEach(el => el.remove());
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
			} catch (err) {
				console.error(err);
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

	async addOverlay({
		x = 0,
		y = 0,
		height = 0,
		width = 0,
		fill = '#000000',
	}) {
		const overlay = this.ownerDocument.createElement('div');
		overlay.slot = 'overlay';
		overlay.dataset.x = x.toString();
		overlay.dataset.y = y.toString();
		overlay.dataset.width = width.toString();
		overlay.dataset.height = height.toString();
		overlay.dataset.fill = fill.toString();
		this.append(overlay);
		return overlay;
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
				const oldMirror = this.mirror;
				this.mirror = false;
				this.#renderFrame();
				this.#canvas.toBlob(resolve, this.type, this.quality);
				this.mirror = oldMirror;
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

	#renderItem(item, ctx, scaleFactor = 1) {
		if (showItem(item)) {
			try {
				switch (item.type) {
					case 'overlay':
						ctx.fillStyle = item.fill;
						ctx.fillRect(Math.round(item.x * scaleFactor), Math.round(item.y * scaleFactor), Math.round(item.width * scaleFactor), Math.round(item.height * scaleFactor));
						break;

					case 'image':
						ctx.drawImage(item.el, Math.round(item.x * scaleFactor), Math.round(item.y * scaleFactor), Math.round(item.width * scaleFactor), Math.round(item.height * scaleFactor));
						break;

					case 'svg':
						if (this.#blobImages.has(item.el)) {
							ctx.drawImage(this.#blobImages.get(item.el), Math.round(item.x * scaleFactor), Math.round(item.y * scaleFactor), Math.round(item.width * scaleFactor), Math.round(item.height * scaleFactor));
						}
						break;

					case 'text':
						ctx.font = item.font;
						ctx.fillStyle = item.fill;
						ctx.lineWidth = item.lineWidth;
						ctx.fillText(item.text, Math.round(item.x * scaleFactor), Math.round(item.y * scaleFactor));
						break;

					default:
						throw new TypeError(`Unknown type to render: "${item.type ?? 'unknown'}".`);
				}
			} catch (err) {
				console.error(err);
			}
		}
	}

	#renderItems(items, ctx, scaleFactor = 1) {
		if (items.size !== 0) {
			for (const item of items.values()) {
				this.#renderItem(item, ctx, scaleFactor);
			}
		}
	}

	#renderCamera(ctx) {
		if (this.mirror) {
			this.#ctx.save();
			this.#ctx.scale(-1, 1);
			this.#ctx.drawImage(this.#video, -ctx.canvas.width, 0, ctx.canvas.width, ctx.canvas.height);
			this.#ctx.restore();
		} else {
			this.#ctx.drawImage(this.#video, 0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	}

	#renderFrame({ signal } = {}) {
		if (signal instanceof AbortSignal && signal.aborted) {
			this.stop();
		} else if (this.hideItems) {
			this.#renderCamera(this.#ctx);
			requestAnimationFrame(() => this.#renderFrame({ signal }));
		} else {
			const scaleFactor = this.aspectRatio > 1 ? this.nativeWidth / 1280 : this.nativeHeight / 1280;
			this.#renderCamera(this.#ctx);
			this.#renderItems(this.#overlays, this.#ctx, scaleFactor);
			this.#renderItems(this.#media, this.#ctx, scaleFactor);
			requestAnimationFrame(() => this.#renderFrame({ signal }));
		}
	}

	#getMediaInfo(el) {
		const { x = 0, y = 0, fill = '#000000', font = '20px sans-serif', lineWidth = 1, media } = el.dataset;
		const type = getType(el);
		const [width, height] = getDimensions(el);
		const text = type === 'text' ? el.textContent.trim() : '';

		if (type === 'svg' && !this.#blobImages.has(el)) {
			const blob = new Blob([el.outerHTML], { type: 'image/svg+xml' });
			const img = new Image(width, height);
			img.src = URL.createObjectURL(blob);
			img.crossOrigin = 'anonymous';
			img.decode().then(() => this.#blobImages.set(el, img));
		}

		return Object.freeze({
			x: Math.max(parseInt(x), 0),
			y: Math.max(parseInt(y), 0),
			width,
			height,
			type,
			text,
			fill,
			font,
			lineWidth: Math.max(parseInt(lineWidth), 1),
			media: typeof media === 'string' ? matchMedia(media) : null,
			el,
		});
	}

	async #requestWakeLock() {
		if ('wakeLock' in navigator && !(this.#wakeLock instanceof globalThis.WakeLockSentinel && !this.#wakeLock.released)) {
			try {
				this.#wakeLock = await navigator.wakeLock.request('screen');

				/*
				* For some reason, a lock is sometimes granted but already released
				*/
				if (!this.#wakeLock.released) {
					this.#wakeLock.addEventListener('release', () => {
						if (this.ownerDocument.visibilityState !== 'visible' && this.active) {
							this.ownerDocument.addEventListener('visibilitychange', () => {
								this.#requestWakeLock();
							}, { signal: this.#controller.signal, once: true });
						}
					});
				}
			} catch (err) {
				console.error(err);
			}
		}
	}

	async #snapShutter() {
		if (this.shutter) {
			await this.#canvas.animate([
				{ filter: 'none' },
				{ filter: 'brightness(10)' },
				{ filter: 'none' },
			], {
				duration: 200,
				easing: 'ease-in-out',
			}).finished;
		}
	}

	async #waitForDelay() {
		const delay = this.delay;

		if (Number.isFinite(delay) && delay > 0) {
			const { height, width } = this;
			const size = parseInt(Math.min(height, width) * 0.85);

			const countdown = await this.addText(parseInt(delay).toString(), {
				fill: '#fafafa',
				font: `${size}px monospace`,
				x: parseInt((width - size / 2) / 2),
				y: parseInt((height + size / 2) / 2),
			});

			const timer = setInterval(() => {
				let { text, ...attrs } = this.#media.get(countdown);
				text = (parseInt(text) - 1).toString();
				this.#media.set(countdown, { text, ...attrs });
				countdown.textContent = text;
			}, 1000);

			await new Promise(resolve => setTimeout(() => {
				clearInterval(timer);
				countdown.remove();
				requestAnimationFrame(resolve);
			}, parseInt(delay * 1000)));
		}
	}

	static get observedAttributes() {
		return ['facingmode', 'resolution'];
	}

	static create({
		images = [],
		text = [],
		overlays = [],
		fonts = {},
		type = 'image/jpeg',
		quality = 0.9,
		resolution = '1280x720',
		delay = 0,
		shutter = true,
		mirror = false,
		frontFacing = true,
		hideItems = false,
		classList = [],
		id = null,
		share: {
			title: shareTitle,
			text: shareText,
			url: shareURL,
		} = {},
		...attrs
	} = {}) {
		const photoBooth = new HTMLPhotoBoothElement();
		photoBooth.type = type;
		photoBooth.quality = quality;
		photoBooth.shutter = shutter;
		photoBooth.frontFacing = frontFacing;
		photoBooth.mirror = mirror;
		photoBooth.delay = delay;
		photoBooth.resolution = resolution;

		Object.entries(fonts).forEach(([name, { src, ...descriptors }]) => {
			photoBooth.addFont(new FontFace(name, `url("${src}")`, descriptors)).catch(console.error);
		});

		images.forEach(({ src, height, width, x, y, media }) => {
			photoBooth.addImage(src, { height, width, x, y, media });
		});

		text.forEach(({ string, x, y, fill, font, media }) => {
			photoBooth.addText(string, { fill, x, y, font, media });
		});

		overlays.forEach(({ x, y, height, width, fill, media }) => {
			photoBooth.addOverlay({ x, y, height, width, fill, media });
		});

		Object.entries(attrs).forEach(([key, val]) => photoBooth.setAttribute(key, val));

		if (typeof shareTitle === 'string') {
			photoBooth.dataset.title = shareTitle;
		}

		if (typeof shareText === 'string') {
			photoBooth.dataset.text = shareText;
		}

		if (typeof shareURL === 'string') {
			photoBooth.dataset.url = shareURL;
		} else if (shareURL instanceof URL) {
			photoBooth.dataset.url = shareURL.href;
		}

		if (hideItems) {
			photoBooth.hideItems = true;
		}

		if (Array.isArray(classList) && classList.length !== 0) {
			photoBooth.classList.add(...classList);
		}

		if (typeof id === 'string') {
			photoBooth.id = id;
		}

		return photoBooth;
	}

	static async loadFromURL(url, opts) {
		return HTMLPhotoBoothElement.create(await getJSON(url, opts));
	}
}

customElements.define('photo-booth', HTMLPhotoBoothElement);
