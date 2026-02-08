import { html } from '@aegisjsproject/parsers/html.js';
import { css } from '@aegisjsproject/parsers/css.js';
import { WEBP as WEBP_MIME, PNG as PNG_MIME, JPEG as JPEG_MIME } from '@shgysk8zer0/consts/mimes.js';
import { WEBP as WEBP_EXT, PNG as PNG_EXT, JPEG as JPEG_EXT } from '@shgysk8zer0/consts/exts.js';
import { createImage, createElement } from '@shgysk8zer0/kazoo/elements.js';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { saveBlob } from '@shgysk8zer0/kazoo/filesystem.js';

const COMMANDS = new Map();

export class CanvasCaptureEvent extends Event {
	/** @private {CanvasRenderingContext2D} */
	#ctx;

	/** @private {Blob|null} */
	#blob;

	/**
	 *
	 * @param {string} type
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Blob|null} blob
	 */
	constructor(type, ctx, blob = null) {
		super(type, { cancelable: true, bubbles: false, composed: false });
		this.#ctx = ctx;
		this.#blob = blob;
	}

	get blob() {
		return this.#blob;
	}

	get ctx() {
		return this.#ctx;
	}

	get canvas() {
		return this.#ctx.canvas;
	}

	get width() {
		return this.#ctx.canvas.width;
	}

	get height() {
		return this.#ctx.canvas.height;
	}
}

export class HTMLPhotoBoothElement extends HTMLElement {
	/** @private {ShadowRoot} */
	#shadow = this.attachShadow({ mode: 'open' });

	/** @private {ElementInternals} */
	#internals = this.attachInternals();

	/** @private {HTMLSlotElement} */
	#overlaySlot;

	/** @private {HTMLSlotElement} */
	#textSlot;

	/** @private {HTMLSlotElement} */
	#mediaSlot;

	/** @private {HTMLSlotElement} */
	#videoSlot;

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

	/** @private {AbortController} */
	#runningController;

	/** @private {MediaQueryList} */
	#mediaQuery = matchMedia('(orientation: landscape');

	/** @private {Map<Element,object>} */
	#blobImages = new Map();

	/** @private {WakeLockSentinel|null} */
	#wakeLock = null;

	/** @private {Number} */
	#prerenderTimeout = NaN;

	/** @private {OffscreenCanvas|null} */
	#offscreenCanvas = null;

	/** @private {CanvasRenderingContext2D|null} */
	#offscreenCtx = null;

	/** @private {ImageBitmap|null} */
	#imageBitmap = null;

	/** @private {Set<object>} */
	#renderExtras = new Set();

	constructor() {
		super();
		this.#internals.states.add('--inactive');

		if (globalThis[Symbol.for('polyfill-command')] instanceof Function) {
			globalThis[Symbol.for('polyfill-command')](this.#shadow);
		}

		this.addEventListener('command', async event => {
			switch (event.command) {
				case '--start':
					this.start({ fullscreen: true });
					break;

				case '--stop':
					if (this.#shadow.getElementById('opts').open) {
						this.closeSettings();
					} else {
						this.stop();
					}
					break;

				case '--fullscreen':
					if (this.hasAttribute('popover')) {
						this.showPopover();
					} else {
						this.requestFullscreen();
					}
					break;

				case '--exit-fullscreen':
					if (this.isSameNode(this.ownerDocument.fullscreenElement)) {
						this.ownerDocument.exitFullscreen();
					} else if (this.hasAttribute('popover')) {
						this.hidePopover();
					}
					break;

				case '--capture':
					this.closeSettings();
					await this.#waitForDelay();

					if (this.dispatchEvent(new CanvasCaptureEvent('beforecapture', this.#ctx))) {
						this.#snapShutter();

						if (this.saveOnCapture) {
							const blob = await this.saveAs(`capture-${new Date().toISOString()}${this.ext}`, { type: 'blob' });
							this.dispatchEvent(new CanvasCaptureEvent('aftercapture', this.#ctx, blob));
						} else {
							const blob = await this.toBlob();
							this.dispatchEvent(new CanvasCaptureEvent('aftercapture', this.#ctx, blob));
						}
					}

					break;

				case '--share':
					this.closeSettings();
					await this.#waitForDelay();

					if (this.dispatchEvent(new CanvasCaptureEvent('beforecapture',  this.#ctx))) {
						this.#snapShutter();
						await this.share();
						this.dispatchEvent(new CanvasCaptureEvent('aftercapture', this.#ctx));
					}
					break;

				default:
					if (COMMANDS.has(event.command)) {
						const callback = COMMANDS.get(event.command);
						callback.call(this, event);
					} else {
						console.log(`Unhandled command: "${event.command}".`);
					}
			}
		});
	}

	connectedCallback() {
		this.#controller = new AbortController();
		const signal = this.#controller.signal;
		const passive = true;

		signal.addEventListener('abort', () => this.stop.bind(this), { once: true });

		this.#shadow.adoptedStyleSheets = [styles];
		this.#shadow.replaceChildren(template.cloneNode(true));

		this.#shadow.querySelectorAll('button[command]').forEach(btn => btn.commandForElement = this);

		this.#shadow.querySelector('form').addEventListener('submit', event => {
			event.preventDefault();
			event.target.closest('details').open = false;
		});

		this.#overlaySlot = this.#shadow.getElementById('overlay');
		this.#mediaSlot = this.#shadow.getElementById('media');
		this.#videoSlot = this.#shadow.getElementById('videos');
		this.#textSlot = this.#shadow.getElementById('text');
		this.#canvas = this.#shadow.getElementById('canvas');
		this.#video = this.#shadow.getElementById('stream');
		this.#ctx = this.#canvas.getContext('2d');

		this.#mediaSlot.addEventListener('slotchange', this.#prerender.bind(this), { signal, passive });
		this.#overlaySlot.addEventListener('slotchange', this.#prerender.bind(this), { signal, passive });

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

		const toggleFullscreen = ({ type, newState } = {}) => {
			switch (type) {
				case 'beforetoggle':
					this.#shadow.getElementById('exit-fullscreen').disabled = newState === 'closed';
					this.#shadow.getElementById('fullscreen').disabled = newState === 'open';

					if  (newState === 'open' && ! this.active) {
						this.start();
					} else if (newState === 'closed' && this.active) {
						this.stop();
					}
					break;

				case 'fullscreenchange':
					if (this.isSameNode(this.ownerDocument.fullscreenElement)) {
						this.#shadow.getElementById('exit-fullscreen').disabled = false;
						this.#shadow.getElementById('fullscreen').disabled = true;
					} else {
						this.#shadow.getElementById('exit-fullscreen').disabled = true;
						this.#shadow.getElementById('fullscreen').disabled = false;
					}
					break;

				default:
					throw new TypeError('Unhandled event type: ' + type);

			}
		};

		this.ownerDocument.addEventListener('fullscreenchange', toggleFullscreen, { signal, passive });
		this.addEventListener('beforetoggle', toggleFullscreen, { signal, passive });

		this.#mediaQuery.addEventListener('change', () => {
			if (this.active) {
				this.start();
			}
		}, { signal, passive });

		this.#shadow.getElementById('fullscreen').disabled = false;

		if (navigator.share instanceof Function) {
			this.#shadow.getElementById('share').disabled = false;
		} else {
			this.#shadow.getElementById('share').disabled = true;
		}

		this.dispatchEvent(new Event('connected'));
	}

	disconnectedCallback() {
		this.#abort(`<${this.tagName}> was disconnected.`);
		this.stop();

		if (this.#blobImages.size !== 0) {
			this.#blobImages.value().forEach(img => URL.revokeObjectURL(img.src));
			this.#blobImages.clear();
		}
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

	[Symbol.dispose]() {
		this.stop();
		this.inert = true;

		if (this.#blobImages.size !== 0) {
			this.#blobImages.value().forEach(img => URL.revokeObjectURL(img.src));
			this.#blobImages.clear();
		}
	}

	get signal() {
		if (this.#controller instanceof AbortController) {
			return this.#controller.signal;
		} else {
			return AbortSignal.abort('No active controller.');
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

	get overlayElements() {
		return this.#overlaySlot.assignedElements();
	}

	get mediaElements() {
		return this.#mediaSlot.assignedElements();
	}

	get textElements() {
		return this.#textSlot.assignedElements();
	}

	get videoElements() {
		return this.#videoSlot.assignedElements();
	}

	get orientation() {
		const aspectRatio = this.aspectRatio;

		if (!Number.isFinite(aspectRatio)) {
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
			return HTMLPhotoBoothElement.DEFAULT_RESOLUTION;
		}
	}

	set resolution(val) {
		if (typeof val !== 'string' || !val.includes('x')) {
			throw new TypeError('Invalid resolution.');
		} else if (val !== this.resolution) {
			const [idealWidth, idealHeight] = val.split('x').map(n => parseInt(n));

			if (!(Number.isSafeInteger(idealHeight) && Number.isSafeInteger(idealWidth) && idealHeight > 0 && idealWidth > 0)) {
				throw new DOMException('Error parsing given resolution.');
			} else {
				this.setAttribute('resolution', `${idealWidth}x${idealHeight}`);
			}
		}
	}

	get scaleFactor() {
		if (this.active) {
			const [width, height] = this.aspectRatio > 1 ? [1280, 720] : [720, 1280];
			return { scaleX: this.#video.videoWidth / width, scaleY: this.#video.videoHeight / height };
		} else {
			return { scaleX: NaN, scaleY: NaN };
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

	get saveOnCapture() {
		return this.hasAttribute('saveoncapture');
	}

	set saveOnCapture(val) {
		this.toggleAttribute('saveoncapture', val);
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
			return this.getAttribute('type') ?? HTMLPhotoBoothElement.DEFAULT_TYPE;
		} else {
			return HTMLPhotoBoothElement.DEFAULT_TYPE;
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
				return HTMLPhotoBoothElement.types.find(type => type.mime === HTMLPhotoBoothElement.DEFAULT_TYPE);
		}
	}

	get parsedResolution() {
		const [width, height] = this.resolution.split('x').map(n => parseInt(n));
		return { width, height };
	}

	get cameraConfig() {
		const { width, height } = this.parsedResolution;

		return {
			video: {
				facingMode: this.facingMode,
				width: {
					min: 1,
					ideal: width,
				},
				height: {
					min: 1,
					ideal: height,
				},
			}
		};
	}

	async start({ signal, fullscreen =  false } = {}) {
		if (this.active) {
			this.stop({ exitFullscreen: false });
		}

		await this.whenConnected;

		this.#stream = await navigator.mediaDevices.getUserMedia(this.cameraConfig);
		this.#requestWakeLock();

		this.#video.srcObject = this.#stream;

		if (this.#runningController instanceof AbortController && ! this.#runningController.signal.aborted) {
			this.#runningController.abort('Component restarted.');
		}

		this.#runningController = new AbortController();

		this.#video.addEventListener('canplay', () => {
			this.#video.play();
			this.#canvas.height = this.#video.videoHeight;
			this.#canvas.width = this.#video.videoWidth;
			this.#offscreenCanvas = new OffscreenCanvas(this.#canvas.width, this.#canvas.width);
			this.#offscreenCtx = this.#offscreenCanvas.getContext('2d', { alpha: true });
			this.#internals.states.delete('--inactive');
			this.#internals.states.add('--active');
			this.#internals.states.add('--' + this.orientation);
			const { scaleX, scaleY } = this.scaleFactor;

			this.#playVideos();
			this.#prerender();

			this.#renderFrame({
				scaleX,
				scaleY,
				once: false,
				signal: signal instanceof AbortSignal
					? AbortSignal.any([signal, this.#controller.signal, this.#runningController.signal])
					: AbortSignal.any([this.#controller.signal, this.#runningController.signal]),
			});

			this.#shadow.getElementById('start').disabled = true;
			this.dispatchEvent(new Event('start'));
			this.closeSettings();

			if (fullscreen) {
				this.requestFullscreen();
			}
		}, { once: true });
	}

	stop({ exitFullscreen = true } = {}) {
		if (this.#runningController instanceof AbortController && ! this.#runningController.signal.aborted) {
			this.#runningController.abort('Component stopped.');
		}

		if (this.#stream instanceof MediaStream) {
			this.#video.pause();
			this.#stopVideos();
			this.#video.srcObject = null;
			this.#stream.getTracks().forEach(track => track.stop());
			this.#stream = null;
			this.#video.srcObject = null;
			this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
			this.#ctx.reset();
			this.#stream = null;
			this.dispatchEvent(new Event('stop'));
			this.#internals.states.clear();
			this.#internals.states.add('--inactive');
			this.#shadow.getElementById('start').disabled = false;
			this.#renderExtras.clear();

			if ('wakeLock' in navigator && this.#wakeLock instanceof globalThis.WakeLockSentinel && !this.#wakeLock.released) {
				this.#wakeLock.release();
				this.#wakeLock = null;
			}

			if (exitFullscreen && this.isSameNode(document.fullscreenElement)) {
				this.ownerDocument.exitFullscreen();
			} else if (exitFullscreen && this.hasAttribute('popover')) {
				this.hidePopover();
			}

			if (this.#imageBitmap instanceof ImageBitmap) {
				this.#imageBitmap.close();
				this.#imageBitmap = null;
			}
		}
	}

	clearMedia() {
		this.mediaElements.forEach(el => el.remove());
	}

	clearOverlays() {
		this.overlayElements.forEach(el => el.remove());
	}

	openSettings() {
		if  (this.isConnected) {
			this.#shadow.getElementById('opts').open = true;
		}
	}

	closeSettings()  {
		if (this.isConnected) {
			this.#shadow.getElementById('opts').open = false;
		}
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

		img.slot = 'media';
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
		fontFamily = 'sans-serif',
		fontWeight = 'normal',
		fontSize = 20,
		x,
		y,
		media,
	} = {}) {
		const el = createElement('span', {
			text,
			dataset: { fill, fontFamily, fontWeight, fontSize, x, y },
			slot: 'text',
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
		media,
	}) {
		const overlay = createElement('div', {
			slot: 'overlay',
			dataset: { x, y, width, height, fill, media },
		});

		this.append(overlay);

		return overlay;
	}

	async addVideo(src, {
		x = 0,
		y = 0,
		height,
		width,
		crossOrigin = 'anonymous',
		loop = true,
		media,
	} = {}) {
		const { resolve, reject, promise } = Promise.withResolvers();
		const video = document.createElement('video');
		const controller = new AbortController();
		const signal = controller.signal;
		video.dataset.x = x.toString();
		video.dataset.y = y.toString();
		video.muted = true;
		video.loop = loop;
		video.preload = 'metadata';

		if (typeof crossOrigin === 'string') {
			video.crossOrigin = crossOrigin;
		}

		video.addEventListener('canplay', ({ target }) => {
			if (typeof width !== 'number' || typeof height !== 'number') {
				target.width = target.videoWidth;
				target.height = target.videoHeight;
			} else {
				video.width = width;
				video.height = height;
			}

			video.slot = 'video';
			resolve(target);
			controller.abort('Video ready.');
		}, { signal });

		video.addEventListener('error', ({ target }) => {
			const err = new DOMException(`Error loading video from ${target.src}`);
			reject(err);
			controller.abort(err);
		}, { signal });

		if (typeof media === 'string') {
			video.dataset.media = media;
		} else if (media instanceof MediaQueryList) {
			video.dataset.media = media.media;
		}

		signal.addEventListener('abort', this.#stopVideos.bind(this), { once: true });

		video.src = src;
		this.append(video);

		return await promise;
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

		if (this.active) {
			const oldMirror = this.mirror;
			this.mirror = false;
			this.#canvas.toBlob(resolve, this.type, this.quality);
			this.mirror = oldMirror;
		} else {
			reject(new DOMException('Component is not active.'));
		}

		return await promise;
	}

	async toBlobURL() {
		return URL.createObjectURL(await this.toBlob());
	}

	async toDataURL() {
		const { promise, resolve, reject } = Promise.withResolvers();

		if (this.active)  {
			resolve(this.#canvas.toDataURL(this.type, this.quality));

		} else {
			reject(new DOMException('Component is not active.'));
		}

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
		URL.revokeObjectURL(img.src);
		return img;
	}

	async getImageData(...args) {
		if (! this.active) {
			throw new DOMException('Canvas not available.');
		} else if (args.length === 0) {
			return this.#ctx.getImageData(0, 0, this.#canvas.width, this.#canvas.height);
		} else {
			return this.#ctx.getImageData.apply(this.ctx, args);
		}
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

	async saveAs(filename, { type = 'blob' } = {}) {
		const { resolve, promise } = Promise.withResolvers();

		if (this.active) {

			if (type === 'blob') {
				const blob = await this.toBlob();
				saveBlob(blob, filename);
				resolve(blob);
			} else if (type === 'data') {
				const a = document.createElement('a');
				a.href = await this.toDataURL();
				resolve(null);
				a.download = filename;
				a.hidden = true;
				this.ownerDocument.body.append(a);

				setTimeout(() => {
					URL.revokeObjectURL(a.href);
					a.remove();
				}, 200);

				a.click();
			} else {
				throw new TypeError(`Invalid type requested: "${type}."`);
			}
		}

		return promise;
	}

	#abort(reason) {
		if (this.#controller instanceof AbortController) {
			this.#controller.abort(reason);
		}

		if (this.#runningController instanceof AbortController && ! this.#runningController.signal.aborted) {
			this.#runningController.abort(reason);
		}
	}

	async #renderSlot(slot, ctx){
		await Promise.all(slot.assignedElements().filter(showEl).map(async el => {
			const item = await this.#getMediaInfo(el);
			this.#renderItem(item, ctx);
		}));
	}

	#addRenderItem({
		type = null,
		x = 0,
		y = 0,
		width = NaN,
		height = NaN,
		fill = '#000000',
		fontFamily = 'sans-serif',
		fontWeight = 'normal',
		fontSize = 20,
		lineWidth = 1,
		text,
		media,
	}) {
		if (typeof type !== 'string') {
			throw new TypeError('Item type must be a string.');
		} else {
			const item = { type, x, y, width, height, fill, fontFamily, fontSize, fontWeight, lineWidth, text, media };
			this.#renderExtras.add(item);
			return item;
		}
	}

	async #prerender() {
		const { resolve, reject, promise } = Promise.withResolvers();

		if  (this.active) {

			const timeout = this.#prerenderTimeout;

			this.#prerenderTimeout = setTimeout(async () => {
				if (! Number.isNaN(timeout) && timeout !== this.#prerenderTimeout) {
					reject(new DOMException('Pre-rendering aborted'));
				} else {
					const { scaleX, scaleY } = this.scaleFactor;
					this.#offscreenCanvas.height = this.#canvas.height;
					this.#offscreenCanvas.width  = this.#canvas.width;
					this.#offscreenCtx.clearRect(0, 0, this.#offscreenCanvas.width, this.#offscreenCanvas.height);
					this.#offscreenCtx.scale(scaleX, scaleY);

					// Do not use `Promise.all` as order matters
					await this.#renderSlot(this.#overlaySlot, this.#offscreenCtx);
					await this.#renderSlot(this.#mediaSlot, this.#offscreenCtx);
					await this.#renderSlot(this.#textSlot, this.#offscreenCtx);

					requestAnimationFrame(() => {
						if (this.#imageBitmap instanceof ImageBitmap) {
							this.#imageBitmap.close();
						}

						this.#imageBitmap = this.#offscreenCanvas.transferToImageBitmap();
						this.#prerenderTimeout = NaN;
						resolve();

						if (this.#blobImages.size !== 0) {
							for (const img of this.#blobImages.values()) {
								URL.revokeObjectURL(img.src);
							}

							this.#blobImages.clear();
						}
					});
				}
			}, 16);

		} else {
			resolve();
		}

		await promise;
	}

	#renderItem(item, ctx) {
		try {
			switch (item.type) {
				case 'overlay':
					ctx.fillStyle = item.fill;
					ctx.fillRect(item.x, item.y, item.width, item.height);
					break;

				case 'image':
				case 'canvas':
				case 'video':
					ctx.drawImage(item.el, item.x, item.y, item.width, item.height);
					break;

				case 'svg':
					if (this.#blobImages.has(item.el)) {
						ctx.drawImage(this.#blobImages.get(item.el), item.x, item.y, item.width, item.height);
					}
					break;

				case 'text':
					ctx.font = `${item.fontWeight} ${item.fontSize}px ${item.fontFamily}`;
					ctx.fillStyle = item.fill;
					ctx.lineWidth = item.lineWidth;
					ctx.fillText(item.text, item.x, item.y);
					break;

				default:
					throw new TypeError(`Unknown type to render: "${item.type ?? 'unknown'}".`);
			}
		} catch (err) {
			console.error(err);
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

	#renderFrame({ signal, once = false, scaleX = 1, scaleY = 1 } = {}) {
		if (signal instanceof AbortSignal && signal.aborted) {
			this.stop();
		} else if (this.hideItems) {
			this.#renderCamera(this.#ctx);

			if (this.#renderExtras.size !== 0) {
				this.#ctx.save();
				this.#ctx.scale(scaleX, scaleY);
				this.#renderExtras.forEach(item => this.#renderItem(item, this.#ctx));
				this.#ctx.restore();
			}

			if (! once) {
				requestAnimationFrame(() => this.#renderFrame({ signal, scaleX, scaleY }));
			}
		} else {
			this.#renderCamera(this.#ctx);

			this.#videoSlot.assignedElements().filter(showEl).forEach(video => renderVideo(video, this.#ctx));

			if (this.#imageBitmap instanceof ImageBitmap) {
				this.#ctx.drawImage(this.#imageBitmap, 0, 0, this.#imageBitmap.width, this.#imageBitmap.height);
			}

			if (this.#renderExtras.size !== 0) {
				this.#ctx.save();
				this.#ctx.scale(scaleX, scaleY);
				this.#renderExtras.forEach(item => this.#renderItem(item, this.#ctx));
				this.#ctx.restore();
			}

			if (! once) {
				requestAnimationFrame(() => this.#renderFrame({ signal, scaleX, scaleY }));
			}
		}
	}

	async #getMediaInfo(el) {
		const { x = 0, y = 0, fill = '#000000', fontFamily = 'sans-serif', fontWeight = 'normal', fontSize = 20, lineWidth = 1, media } = el.dataset;
		const type = el.slot === 'overlay' ? 'overlay' : getType(el);
		const [width, height] = getDimensions(el);
		const text = type === 'text' ? el.textContent.trim() : '';

		if (type === 'svg' && !this.#blobImages.has(el)) {
			const blob = new Blob([el.outerHTML], { type: 'image/svg+xml' });
			const img = new Image(width, height);
			img.src = URL.createObjectURL(blob);
			img.crossOrigin = 'anonymous';
			await img.decode().then(() => this.#blobImages.set(el, img)).catch(console.error);
		}

		return Object.freeze({
			x: Math.max(parseInt(x), 0),
			y: Math.max(parseInt(y), 0),
			width,
			height,
			type,
			text,
			fill,
			fontWeight,
			fontSize,
			fontFamily,
			sort: MEDIA_TYPES.indexOf(type),
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
			const [size, width, height] = this.aspectRatio > 1
				? [612, 1280, 720]
				: [612, 720, 1280];

			const countdown = this.#addRenderItem({
				type: 'text',
				fill: '#fafafa',
				fontFamily: 'monospace',
				fontSize: size,
				x: parseInt((width - size / 2) / 2),
				y: parseInt((height + size / 2) / 2),
				text: parseInt(delay).toString(),
			});

			const timer = setInterval(async () => {
				if (countdown.text !== '1') {
					countdown.text = (parseInt(countdown.text) - 1).toString();
				} else {
					clearInterval(timer);
				}
			}, 1000);

			await new Promise(resolve => setTimeout(async () => {
				clearInterval(timer);
				countdown.text = '';

				if (this.#renderExtras.has(countdown)) {
					this.#renderExtras.delete(countdown);
				}

				requestAnimationFrame(() => resolve());
			}, parseInt(delay * 1000)));
		}
	}

	#playVideos() {
		this.#videoSlot.assignedElements().filter(showEl).forEach(el => {
			if (el.tagName === 'VIDEO') {
				el.play();
			}
		});
	}

	#stopVideos() {
		this.#videoSlot.assignedElements().forEach(el => {
			if (el.tagName === 'VIDEO') {
				el.pause();
			}
		});
	}

	static get observedAttributes() {
		return ['facingmode', 'resolution'];
	}

	static get resolutions() {
		const { QVGA, VGA, FWVGA, qHD, HD, FULL_HD, QHD, UHD } = HTMLPhotoBoothElement;

		return [
			{ label: 'QVGA', resolution: QVGA },
			{ label: 'VGA', resolution: VGA },
			{ label: 'FWVGA', resolution: FWVGA },
			{ label: 'qHD', resolution: qHD },
			{ label: 'HD (720P)', resolution: HD },
			{ label: 'Full HD (1080P)', resolution: FULL_HD },
			{ label: 'QHD (1440P)', resolution: QHD },
			{ label: '4K UHD (2160P)', resolution: UHD },
		];
	}

	static get types() {
		return [{
			label: 'JPEG',
			ext: JPEG_EXT,
			mime: JPEG_MIME,
		},{
			label: 'PNG',
			ext: PNG_EXT,
			mime: PNG_MIME,
		}, {
			label: 'WebP',
			ext: WEBP_EXT,
			mime: WEBP_MIME,
		}];
	}

	static get JPEG() {
		return JPEG_MIME;
	}

	static get PNG() {
		return PNG_MIME;
	}

	static get WebP() {
		return WEBP_MIME;
	}

	static get DEFAULT_TYPE() {
		return this.JPEG;
	}

	static get QVGA() {
		return '320x240';
	}

	static get VGA() {
		return '640x480';
	}

	static get FWVGA() {
		return '854x480';
	}

	static get qHD() {
		return '960x540';
	}

	static get HD() {
		return '1280x720';
	}

	static get FULL_HD() {
		return '1920x1080';
	}
	static get QHD() {
		return '2560x1440';
	}

	static get UHD() {
		return '3840x2160';
	}

	static get DEFAULT_RESOLUTION() {
		return HTMLPhotoBoothElement.HD;
	}

	static registerCommand(command, callback) {
		if (typeof command !== 'string' || ! command.startsWith('--')) {
			throw new TypeError('Registered commands must be strings prefixed with "--".');
		} else if (typeof callback !== 'function') {
			throw new TypeError('Callback for registered commands must be functions.');
		} else if (COMMANDS.has(command)) {
			throw new Error(`"${command}" is already a registered command.`);
		} else {
			COMMANDS.set(command, callback);
		}
	}

	static create({
		overlays = [],
		images = [],
		videos = [],
		text = [],
		fonts = {},
		type = HTMLPhotoBoothElement.DEFAULT_TYPE,
		quality = 0.9,
		resolution = HTMLPhotoBoothElement.DEFAULT_RESOLUTION,
		delay = 0,
		shutter = true,
		mirror = false,
		frontFacing = true,
		saveOnCapture = true,
		hideItems = false,
		classList = [],
		id = null,
		dataset = {},
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
		photoBooth.saveOnCapture = saveOnCapture;

		Object.entries(dataset).forEach(([name, value]) => photoBooth.dataset[name] = value);

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

		photoBooth.whenConnected.then(async () => {
			await Promise.allSettled(Object.entries(fonts).map(([name, { src, ...descriptors }]) => {
				return photoBooth.addFont(new FontFace(name, `url("${src}")`, descriptors)).catch(console.error);
			}));

			await Promise.allSettled(overlays.map(({ x, y, height, width, fill, media }) => {
				return photoBooth.addOverlay({ x, y, height, width, fill, media });
			}));

			await Promise.allSettled(videos.map(({ src, width, height, x, y, crossOrigin, loop, media  }) => {
				photoBooth.addVideo(src, { x, y, width, height, crossOrigin, loop, media });
			}));

			await Promise.allSettled(images.map(({ src, height, width, x, y, media }) => {
				photoBooth.addImage(src, { height, width, x, y, media });
			}));

			await Promise.allSettled(text.map(({ string, x, y, fill, fontSize, fontWeight, fontFamily, media }) => {
				photoBooth.addText(string, { fill, x, y, fontSize, fontWeight, fontFamily, media });
			}));
		});

		return photoBooth;
	}

	static async loadFromURL(url, opts) {
		return HTMLPhotoBoothElement.create(await getJSON(url, opts));
	}
}

const MEDIA_TYPES = [
	'overlay',
	'canvas',
	'video',
	'image',
	'svg',
	'text',
];

function normalhandler({ target }) {
	this[target.name] = target.value;
}

function checkboxHandler({ target }) {
	this[target.name] = target.checked;
}

function getDimensions(el) {
	switch (el.tagName.toLowerCase()) {
		case 'img':
		case 'video':
		case 'canvas':
			return [el.width, el.height];

		case 'svg':
			return [el.width.baseVal.value, el.height.baseVal.value];

		default:
			return [parseInt(el.dataset.width), parseInt(el.dataset.height)];
	}
}

function renderVideo(video, ctx) {
	ctx.drawImage(
		video,
		parseInt(video.dataset.x) ?? 0,
		parseInt(video.dataset.y) ?? 0,
		video.hasAttribute('width') ? video.width : video.videoWidth,
		video.hasAttribute('height') ? video.height : video.videoHeight
	);
}

function showEl(el) {
	if (el.hidden) {
		return false;
	} else if ('media' in el.dataset) {
		return matchMedia(el.dataset.media).matches;
	} else {
		return true;
	}
}

function getType(el) {
	switch (el.tagName.toLowerCase()) {
		case 'svg':
			return 'svg';

		case 'img':
			return 'image';

		case 'video':
			return 'video';

		case 'canvas':
			return 'canvas';

		default:
			return 'text';
	}
}

const template = html`
	<details id="opts" class="absolute top full-width overlay" part="settings overlay">
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
					<select id="type" name="type" class="settings-control input block" required="">${HTMLPhotoBoothElement.types.map(({ label, mime }) => `
						<option label="${label}" value="${mime}"></option>
					`).join('')}
					</select>
				</div>
				<div class="form-group">
					<label for="type" class="input-label block">Resolution</label>
					<select id="type" name="resolution" class="settings-control input block" required="">${HTMLPhotoBoothElement.resolutions.map(({label, resolution}) => `
						<option label="${label} (${resolution})"value="${resolution}"></option>
					`).join('')}
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
					<label for="save-on-capture" class="input-label block">Save on Capture</label>
					<input type="checkbox" id="save-on-capture" name="saveOnCapture" class="settings-control" />
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
			<p id="instructions">
				<span>Press the camera</span>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="icon">
					<path fill-rule="evenodd" d="M15.2 2.09L10 5.72V3c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V9.28l5.2 3.63c.33.23.8 0 .8-.41v-10c0-.41-.47-.64-.8-.41z"/>
				</svg>
				<span>button on the bottom to open your camera and get started.</span>
			</p>
		</slot>
	</div>
	<div part="controls overlay" class="panel overlay absolute bottom full-width">
		<button type="button" id="start" class="btn when-inactive" data-action="start" command="--start" title="Open Camera"  aria-label="Open Camera">
			<slot name="start-icon">
				<svg width="96" height="96" viewBox="0 0 16 16" fill="currentColor">
					<path fill-rule="evenodd" d="M15.2 2.09L10 5.72V3c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V9.28l5.2 3.63c.33.23.8 0 .8-.41v-10c0-.41-.47-.64-.8-.41z"/>
				</svg>
			</slot>
		</button>
		<button type="button" id="fullscreen" class="btn when-active" part="btn fullscreen-btn" command="--fullscreen" data-action="fullscreen" title="Enter Fullscreen" aria-label="Enter Fullscreen" disabled="">
			<slot name="fullscreen-icon">
				<svg width="84" height="96" viewBox="0 0 14 16" fill="currentColor">
					<path fill-rule="evenodd" d="M13 10h1v3c0 .547-.453 1-1 1h-3v-1h3v-3zM1 10H0v3c0 .547.453 1 1 1h3v-1H1v-3zm0-7h3V2H1c-.547 0-1 .453-1 1v3h1V3zm1 1h10v8H2V4zm2 6h6V6H4v4zm6-8v1h3v3h1V3c0-.547-.453-1-1-1h-3z"/>
				</svg>
			</slot>
		</button>
		<button type="button" id="exit-fullscreen" class="btn when-active" part="btn exit-fullscreen-btn" command="--exit-fullscreen" data-action="exit-fullscreen" title="Leave Fullscreen" aria-label="Exit Fullscreen" disabled="">
			<slot name="exit-fullscreen-icon">
				<svg width="84" height="96" viewBox="0 0 14 16" fill="currentColor">
					<path fill-rule="evenodd" d="M2 4H0V3h2V1h1v2c0 .547-.453 1-1 1zm0 8H0v1h2v2h1v-2c0-.547-.453-1-1-1zm9-2c0 .547-.453 1-1 1H4c-.547 0-1-.453-1-1V6c0-.547.453-1 1-1h6c.547 0 1 .453 1 1v4zM9 7H5v2h4V7zm2 6v2h1v-2h2v-1h-2c-.547 0-1 .453-1 1zm1-10V1h-1v2c0 .547.453 1 1 1h2V3h-2z"/>
				</svg>
			</slot>
		</button>
		<button type="button" id="toggle-settings" class="btn" part="btn settings-btn" command="--toggle-settings" data-action="toggle-settings" title="Toggle Settings Menu" aria-label="Toggle Settings">
			<slot name="settings-icon">
				<svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor" role="presentation">
					<path fill-rule="evenodd" d="M4 7H3V2h1v5zm-1 7h1v-3H3v3zm5 0h1V8H8v6zm5 0h1v-2h-1v2zm1-12h-1v6h1V2zM9 2H8v2h1V2zM5 8H2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm5-3H7c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm5 4h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1z"/>
				</svg>
			</slot>
		</button>
		<button type="button" id="capture" class="btn when-active" part="btn capture-btn" command="--capture" data-action="capture" title="Capture" aria-label="Capture" accesskey=" ">
			<slot name="capture-icon">
				<svg viewBox="0 0 2 2" fill="currentColor" height="96" width="96" fill="currentColor">
					<circle cx="1" cy="1" r="1"></circle>
				</svg>
			</slot>
		</button>
		<button type="button" id="share" class="btn when-active" part="btn share-btn" command="--share" data-action="share" title="Share" aria-label="Share" accesskey="s" disabled="">
			<slot name="share-icon">
				<svg width="96" height="96" viewBox="0 0 16 16" fill="currentColor">
					<path d="M5.969 7.969a2.969 2.969 0 1 1-5.938 0 2.969 2.969 0 1 1 5.938 0zm9.968 5a2.969 2.969 0 1 1-5.937 0 2.969 2.969 0 1 1 5.937 0zm0-10a2.969 2.969 0 1 1-5.937 0 2.969 2.969 0 1 1 5.937 0z" overflow="visible"/>
					<path d="M12.625 2.156L2.562 7.031.75 7.938l1.812.906 10.032 5.062.906-1.812-8.22-4.156 8.219-4-.875-1.782z" overflow="visible"/>
				</svg>
			</slot>
		</button>
		<slot name="controls" class="when-active"></slot>
		<button type="button" id="stop" class="btn when-active" part="btn stop-btn" command="--stop" data-action="stop" title="Close Camera" aria-label="Close Camera" accesskey="x">
			<slot name="stop-icon">
				<svg width="96" height="96" viewBox="0 0 12 16" fill="currentColor">
					<path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/>
				</svg>
			</slot>
		</button>
	</div>
	<slot name="overlay" id="overlay" hidden=""></slot>
	<slot name="text" id="text" hidden=""></slot>
	<slot name="media" id="media" hidden=""></slot>
	<slot name="video" id="videos" hidden=""></slot>
	<video id="stream" hidden=""></video>
`;

const styles = css`
	:host {
		box-sizing: border-box;
		isolation: isolate;
		position: relative;
		color-scheme: dark;
		background-color: #232323;
	}

	:host(:not([hidden], [popover])) {
		display: block;
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

	.icon {
		height: 1em;
		width: auto;
		vertical-align: middle;
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
		height: auto;
		max-width: 100vw;
		max-height: 100vh;
		max-height: 100dvh;
		object-fit: contain;
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

	#opts:not([open]) {
		display: none;
	}

	#opts[open] {
		height: calc(100% - 128px);
		overflow: auto;
	}

	#placeholder {
		color: #fefefe;
		padding-block: 60px;
		font-size: 2em;
		min-height: 350px;
		max-height: 80vmin;
		overflow: auto;
	}

	#instructions {
		font-size: clamp(18px, 2.4vmin, 24px);
		padding: 1.3em;
		text-align: center;
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

	.btn, ::slotted(button[slot="controls"]) {
		background-color: transparent;
		color: inherit;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.btn:disabled, ::slotted(button[slot="ccontrols"]:disabled) {
		display: none;
	}

	:host(:state(--inactive)) .when-active {
		display: none;
	}

	:host(:state(--active)) .when-inactive {
		display: none;
	}

	:host(:popover-open) {
		border: none;
		max-width: 100vw;
		max-height: 100dvh;
		position: fixed;
		inset: 0 0 0 0;
	}

	:host(:popover-open) #exit-fullscreen {
		display: none;
	}

	:host(:popover-open)::backdrop {
		background-color: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
	}
`;

customElements.define('photo-booth', HTMLPhotoBoothElement);
