import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { whenIntersecting } from '@shgysk8zer0/kazoo/intersect.js';
import { getHTML } from '@shgysk8zer0/kazoo/http.js';
import { getURLResolver, callOnce } from '@shgysk8zer0/kazoo/utility.js';
import { meta } from '../../import.meta.js';
import { loadStylesheet } from '@shgysk8zer0/kazoo/loader.js';
import { getBool, setBool, getString, setString } from '@shgysk8zer0/kazoo/attrs.js';
import { createPolicy } from '@shgysk8zer0/kazoo/trust.js';
import {
	createSpotifyPlaylist, createSpotifyAlbum, createSpotifyArtist, createSpotifyTrack,
	createSpotifyShow, parseURI, linkToUri, uriToLink, policy as embedPolicy,
} from '@shgysk8zer0/kazoo/spotify.js';

const protectedData = new WeakMap();
const resolveURL = getURLResolver({ path: './spotify/', base: meta.url });
const getTemplate = callOnce(() => getHTML(resolveURL('./player.html'), { policy }));

const policy = createPolicy('spotify-player#html', { createHTML: input => input });

registerCustomElement('spotify-player', class HTMLSpotifyPlayerElement extends HTMLElement {
	constructor({ uri = null, large = null, loading = null } = {}) {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		const internals = this.attachInternals();
		protectedData.set(this, { shadow, internals });
		internals.states.add('--loading');

		this.addEventListener('connected', async () => {
			if (typeof uri === 'string') {
				this.uri = uri;
			}

			if (typeof large === 'boolean') {
				this.large = large;
			}

			if (typeof loading === 'string') {
				this.loading = loading;
			}

			if (this.loading === 'lazy') {
				await whenIntersecting(this);
			}

			Promise.all([
				getTemplate(),
				loadStylesheet(resolveURL('./player.css'),{ parent: shadow }),
			]).then(([tmp]) => {
				shadow.append(tmp.cloneNode(true));
				internals.states.delete('--loading');
				internals.states.add('--ready');
				this.dispatchEvent(new Event('ready'));
			});
		}, { once: true });
	}

	connectedCallback() {
		this.dispatchEvent(new Event('connected'));
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

	get credentialless() {
		return this.hasAttribute('credentialless');
	}

	set credentialless(val) {
		this.toggleAttribute('credentialless', val);
	}

	get large() {
		return getBool(this, 'large');
	}

	set large(val) {
		setBool(this, 'large', val);
	}

	get link() {
		if (this.hasAttribute('link')) {
			return this.getAttribute('link');
		} else if (this.hasAttribute('uri')) {
			return uriToLink(this.getAttribute('uri'));
		} else {
			return null;
		}
	}

	set link(val) {
		if (typeof val === 'string' && val.startsWith('https:')) {
			this.uri = null;
			this.setAttribute('link', val);
		} else {
			this.removeAttribute('link');
		}
	}

	get loading() {
		return getString(this, 'loading', { fallback: 'eager' });
	}

	set loading(val) {
		setString(this, 'loading', val);
	}

	get uri() {
		if (this.hasAttribute('uri')) {
			return this.getAttribute('uri');
		} else if (this.hasAttribute('link')) {
			return linkToUri(this.getAttribute('link'));
		} else {
			return null;
		}
	}

	set uri(val) {
		if (typeof val === 'string' && val.startsWith('spotify:')) {
			this.link = null;
			this.setAttribute('uri', val);
		} else {
			this.removeAttribute('uri');
		}
	}

	open() {
		const link = this.link;
		if (typeof link === 'string') {
			globalThis.open(link, '_blank', 'noopener, noreferrer');
			return true;
		} else {
			return false;
		}
	}

	async attributeChangedCallback(name, oldValue, newValue) {
		switch(name) {
			case 'large':
				this.ready.then(async () => {
					const size = newValue === null ? 80 : 380;
					this.querySelectorAll('[slot="player"]').forEach(el => {
						el.height = size;
					});
				});
				break;

			case 'uri':
			case 'link':
				this.ready.then(async () => {
					if (typeof newValue === 'string') {
						const { uri, loading, large, credentialless } = this;
						const { type = null, id = null } = parseURI(uri);
						const { internals } = protectedData.get(this);
						internals.states.add('--loading');

						if (loading === 'lazy') {
							await whenIntersecting(this);
						}

						const iframe = HTMLSpotifyPlayerElement.createSpotifyEmbed(type, id, {
							slot: 'player',
							large,
							credentialless,
							part: ['embed'],
						});

						iframe.addEventListener('load', () => {
							internals.states.delete('--loading');
							this.dispatchEvent(new CustomEvent('trackchange', { detail: {
								from: oldValue,
								to: newValue
							}}));
						}, { once: true });

						this.querySelectorAll('[slot="player"]').forEach(el => el.remove());
						this.append(iframe);
					} else {
						this.querySelectorAll('[slot="player"]').forEach(el => el.remove());
					}
				});
				break;

			default:
				throw new Error(`Unknown attribute changed: ${name}`);
		}

	}

	static createSpotifyEmbed(type, id, { title = 'Spotify Player', large = false, credentialless = false, slot, part } = {}) {
		switch(type) {
			case 'playlist': return createSpotifyPlaylist(id, { title, large, slot, part, credentialless });
			case 'artist': return createSpotifyArtist(id, { title, large, slot, part, credentialless });
			case 'album': return createSpotifyAlbum(id, { title, large, slot, part, credentialless });
			case 'track': return createSpotifyTrack(id, { title, large, slot, part, credentialless });
			case 'show': return createSpotifyShow(id, { title, large, slot, part, credentialless });
			default: throw new TypeError(`Invalid Spotify embed type: ${type}`);
		}
	}

	static get observedAttributes() {
		return [
			'uri',
			'large',
			'link',
		];
	}
});

export const trustPolicies = [policy.name, embedPolicy.name];
