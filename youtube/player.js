import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { createYouTubeEmbed } from '@shgysk8zer0/kazoo/youtube.js';
import { whenIntersecting } from '@shgysk8zer0/kazoo/intersect.js';
import { loaded } from '@shgysk8zer0/kazoo/events.js';
import { getString, setString, getInt, setInt, getBool, setBool } from '@shgysk8zer0/kazoo/attrs.js';

const protectedData = new WeakMap();

registerCustomElement('youtube-player', class HTMLYouTubePlayerElement extends HTMLElement {
	constructor(video, { height, width, credentialless, loading, start, controls } = {}) {
		super();

		requestAnimationFrame(() => {
			if (typeof video === 'string') {
				this.video = video;
			}

			if (typeof height === 'number') {
				this.height = height;
			}

			if (typeof width === 'number') {
				this.width = width;
			}

			if (typeof credentialless === 'boolean') {
				this.credentialless = credentialless;
			}

			if (typeof loading === 'string') {
				this.loading = loading;
			}

			if (typeof start === 'number') {
				this.start = start;
			}

			if (typeof controls === 'boolean') {
				this.controls = controls;
			}
		});

		protectedData.set(this, {
			shadow: this.attachShadow({ mode: 'closed' }),
			timeout: NaN,
		});
	}

	attributeChangedCallback(name, oldVal, newVal) {
		const { shadow, timeout } = protectedData.get(this);

		switch(name) {
			case 'height': {
				const iframe = shadow.querySelector('iframe');

				if (iframe instanceof HTMLIFrameElement) {
					iframe.height = newVal;
				}

				break;
			}

			case 'width': {
				const iframe = shadow.querySelector('iframe');

				if (iframe instanceof HTMLIFrameElement) {
					iframe.width = newVal;
				}

				break;
			}

			case 'credentialless':
			case 'video':
				if (! Number.isNaN(timeout)) {
					clearTimeout(timeout);
				}

				protectedData.set(this, {
					shadow,
					timeout: setTimeout(() => {
						protectedData.set(this, { shadow, timeout: NaN });
						this.render().catch(console.error);
					}, 10),
				});

				break;

			default:
				throw new DOMException(`Unhandled attribute changed: "${name}"`);
		}
	}

	async render() {
		const { credentialless, loading, height, width, video, controls, start } = this;
		const { shadow } = protectedData.get(this);

		if (typeof video === 'string') {
			if (loading === 'lazy') {
				await whenIntersecting(this);
			}

			const iframe = createYouTubeEmbed(video, { width, height, credentialless, start, controls });

			const prom = loaded(iframe).then(() => this.dispatchEvent(new Event('ready')));

			shadow.replaceChildren(iframe);

			await prom;
		} else {
			shadow.replaceChildren();
		}
	}

	get ready() {
		return new Promise(resolve => {
			const { shadow } = protectedData.get(this);

			if (shadow.childElementCount === 0) {
				this.addEventListener('ready', () => resolve(), { once: true });
			} else {
				resolve();
			}
		});
	}

	get height() {
		return getInt(this, 'height', { fallback: 315 });
	}

	set height(val) {
		setInt(this, 'height', val, { min: 0 });
	}

	get width() {
		return getInt(this, 'width', { fallback: 560 });
	}

	set width(val) {
		setInt(this, 'width', val, { min: 0 });
	}

	get loading() {
		return getString(this, 'loading', { fallback: 'eager' });
	}

	set loading(val) {
		setString(this, 'loading', val);
	}

	get controls() {
		return getBool(this, 'controls');
	}

	set controls(val) {
		setBool(this, 'controls', val);
	}

	get credentialless() {
		return getBool(this, 'credentialless');
	}

	set credentialless(val) {
		setBool(this, 'credentialless', val);
	}

	get start() {
		return getInt(this, 'start', { min: 0 });
	}

	set start(val) {
		setInt(this, 'start', { min: 1 });
	}

	get video() {
		const video = this.getAttribute('video');

		if (typeof video !== 'string') {
			return null;
		} else if (video.startsWith('https:')) {
			const url = new URL(video);

			if (url.host === 'youtu.be') {
				return url.pathname.substr(1);
			} else if (! url.host.endsWith('youtube.com')) {
				throw new Error('Invalid URL for YouTube');
			} else if (url.searchParams.has('v')) {
				return url.searchParams.get('v');
			} else if (url.pathname.startsWith('embed')) {
				return url.pathname.split('/')[2];
			} else {
				return url;
			}
		} else {
			return video;
		}
	}

	set video(val) {
		setString(this, 'video', val);
	}

	static get observedAttributes() {
		return ['video', 'credentialless', 'height', 'width'];
	}
});
