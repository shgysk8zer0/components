import '@shgysk8zer0/kazoo/harden.js';
import '@shgysk8zer0/polyfills/all.js';
import '@shgysk8zer0/kazoo/harden.js';
import { createElement } from '@shgysk8zer0/kazoo/elements.js';
import { konami } from '@shgysk8zer0/konami';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { description as setDescription } from '@shgysk8zer0/kazoo/meta.js';

trustedTypes.createPolicy('default', {
	createHTML: input => new Sanitizer().sanitizeFor('div', input).innerHTML,
});

getJSON(import.meta.resolve('../../package.json')).then(({ name, version, description }) => {
	document.title = `${name} v${version}`;
	setDescription(description);
});

Promise.all([
	customElements.whenDefined('youtube-player'),
	konami(),
]).then(([YouTubePlayer]) => {
	const dialog = createElement('dialog', {
		events: { close: ({ target }) => target.remove() },
		children: [
			new YouTubePlayer('dQw4w9WgXcQ', { controls: true }),
			document.createElement('hr'),
			createElement('button', {
				type: 'button',
				classList: ['btn', 'btn-reject'],
				text: 'Close',
				events: { click: ({ target }) => target.closest('dialog').close() },
			})
		]
	});

	document.body.append(dialog);
	dialog.showModal();
});
