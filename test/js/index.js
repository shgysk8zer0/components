// import '@shgysk8zer0/kazoo/harden.js';
import '@shgysk8zer0/polyfills';
import '@shgysk8zer0/kazoo/harden.js';
import { createElement } from '@shgysk8zer0/kazoo/elements.js';
import { konami } from '@shgysk8zer0/konami';
import { name, version } from '../../consts.js';

trustedTypes.createPolicy('default', {
	createHTML: input => new Sanitizer().sanitizeFor('diiv', input).innerHTML,
});

document.title = `${name} v${version}`;

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
