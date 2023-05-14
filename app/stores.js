import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { getManifest } from '@shgysk8zer0/kazoo/http.js';
import { loadImage } from '@shgysk8zer0/kazoo/loader.js';
import { registerButton, promise, signal } from '@shgysk8zer0/kazoo/pwa-install.js';
import { css } from '@shgysk8zer0/kazoo/dom.js';

const loading = 'lazy';
const height = 53;

const getLogoUrl = path => new URL(path, 'https://cdn.kernvalley.us').href;

const styleImg = (img) => css(img, { width: 'auto', height: `${height}px` });

if (! (navigator.getInstalledRelatedApps instanceof Function)) {
	navigator.getInstalledRelatedApps = async () => [];
}

registerCustomElement('app-stores', class HTMLAppStoresElement extends HTMLElement {
	async connectedCallback() {
		const [{ related_applications }, apps = []] = await Promise.all([
			getManifest(),
			navigator.getInstalledRelatedApps(),
		]).catch(console.error);

		const platforms = apps.map(({ platform }) => platform);

		if (Array.isArray(related_applications) && related_applications.length !== 0) {
			const stores = await Promise.allSettled(related_applications.filter(({ platform }) => {
				return ! platforms.includes(platform);
			}).map(({ platform, id, url }) => {
				switch(platform) {
					case 'play':
						return loadImage(getLogoUrl('./img/logos/play-badge.svg'), {
							alt: 'Google Play Store',
							part: ['store-badge', 'play-store-badge'],
							width: 180,
							height,
							loading
						}).then(img => {
							styleImg(img);
							const a = document.createElement('a');
							a.classList.add('app-store', `store-${platform}`);
							a.relList.add('noopener', 'noreferrer', 'external');

							if (typeof url === 'string') {
								a.href = new URL(url, document.baseURI).href;
							} else {
								const link = new URL('https://play.google.com/store/apps/details');
								link.searchParams.set('id', id);
								a.href = link.href;
							}

							a.append(img);
							return a;
						}).catch(console.error);

					case 'itunes':
						return loadImage(getLogoUrl('./img/logos/itunes-badge.svg'), {
							alt: 'App Store',
							part: ['store-badge', 'app-store-badge'],
							width: 158,
							height,
							loading,
						}).then(img => {
							styleImg(img);
							const a = document.createElement('a');
							a.classList.add('app-store', `store-${platform}`);
							a.relList.add('noopener', 'noreferrer', 'external');

							if (typeof url === 'string') {
								a.href = new URL(url, document.baseURI).href;
							}
							a.append(img);
							return a;
						}).catch(console.error);

					case 'f-droid':
						return loadImage(getLogoUrl('./img/logos/f-droid-badge.svg'), {
							alt: 'F-Droid',
							part: ['store-badge', 'f-droid-badge'],
							width: 158,
							height,
							loading,
						}).then(img => {
							styleImg(img);
							const a = document.createElement('a');
							a.classList.add('app-store', `store-${platform}`);
							a.relList.add('noopener', 'noreferrer', 'external');

							if (typeof url === 'string') {
								a.href = new URL(url, document.baseURI).href;
							}
							a.append(img);
							return a;
						}).catch(console.error);

					case 'amazon':
						return loadImage(getLogoUrl('./img/logos/amazon-appstore-badge.svg'), {
							alt: 'App Store',
							part: ['store-badge', 'amazon-appstore-badge'],
							width: 158,
							height,
							loading,
						}).then(img => {
							styleImg(img);
							const a = document.createElement('a');
							a.classList.add('app-store', `store-${platform}`);
							a.relList.add('noopener', 'noreferrer', 'external');

							if (typeof url === 'string') {
								a.href = new URL(url, document.baseURI).href;
							}
							a.append(img);
							return a;
						}).catch(console.error);

					case 'windows':
						return loadImage(getLogoUrl('./img/logos/windows-badge.svg'), {
							alt: 'Microsoft Store',
							part: ['store-badge', 'windows-store-badge'],
							width: 158,
							height,
							loading,
						}).then(img => {
							styleImg(img);
							const a = document.createElement('a');
							a.classList.add('app-store', `store-${platform}`);
							a.relList.add('noopener', 'noreferrer', 'external');

							if (typeof url === 'string') {
								a.href = new URL(url, document.baseURI).href;
							}

							a.append(img);
							return a;
						}).catch(console.error);

					case 'webapp':
						return loadImage(getLogoUrl('/img/logos/pwa-badge.svg'), {
							alt: 'Web App',
							part: ['store-badge', 'pwa-badge'],
							width: 158,
							height,
							loading,
						}).then(img => {
							styleImg(img);
							const btn = document.createElement('button');
							btn.type = 'button';
							btn.disabled = true;
							btn.classList.add('app-store', `store-${platform}`);
							btn.append(img);
							css(btn, {
								'-webkit-appearance': 'none',
								'appearance': 'none',
								'border': '0 none',
								'padding': '0',
								'filter': 'grayscale(1)',
								'cursor': 'not-allowed',
								'background-color': 'transparent',
							});

							promise.then(() => {
								css(btn, { 'filter': false, 'cursor': 'pointer' });
							});

							signal.addEventListener('abort', () => {
								css(btn, { 'filter': 'grayscale(1)', 'cursor': 'not-allowed' });
							}, { once: true });

							registerButton(btn).catch(() => {});
							return btn;
						});

						// case 'chrome_web_store':

					default:
						console.error(`Unknown platform: ${platform}`);

				}
			}));

			if (stores.length === 0) {
				this.hidden = true;
			} else {
				this.append(...stores.filter(({ status }) => status === 'fulfilled')
					.map(({ value }) => value));
			}
		} else {
			this.hidden = true;
		}
	}
});
