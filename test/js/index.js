import '@aegisjsproject/core/polyfill-with-policy.js';
import { createElement } from '@shgysk8zer0/kazoo/elements.js';
import { on } from '@shgysk8zer0/kazoo/dom.js';
import { konami } from '@shgysk8zer0/konami';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { description as setDescription } from '@shgysk8zer0/kazoo/meta.js';
import javascript from 'highlight.js/languages/javascript.min.js';
import xml from 'highlight.js/languages/xml.min.js';
import css from 'highlight.js/languages/css.min.js';

await customElements.whenDefined('mark-down').then(HTMLMarkDownElement => {
	HTMLMarkDownElement.registerLanguage('javascript', javascript);
	HTMLMarkDownElement.registerLanguage('xml', xml);
	HTMLMarkDownElement.registerLanguage('css', css);
}).catch(console.error);

getJSON(import.meta.resolve('../../package.json')).then(({ name, version, description }) => {
	document.title = `${name} v${version}`;
	setDescription(description);
});

on('[data-repo][data-user]', 'click', async ({ currentTarget}) => {
	const HTMLGitHubReadMeElement = await customElements.whenDefined('github-readme');
	const readme = new HTMLGitHubReadMeElement();

	readme.user = currentTarget.dataset.user;
	readme.repo = currentTarget.dataset.repo;
	readme.branch = currentTarget.dataset.branch;

	const dialog = createElement('dialog', {
		events: { close: ({ target }) => target.remove() },
		children: [
			createElement('div', {
				classList: ['flex', 'row', 'sticky', 'top'],
				events: { click: ({ target }) => target.closest('dialog').close() },
				children: [
					createElement('div', { classList: ['grow-1'] }),
					createElement('button', {
						classList: ['btn', 'btn-reject'],
						accesskey: 'x',
						children: [createXIcon({ size: 18, fill: 'currentColor' })],
						aria: { label: 'Close' },
					})
				]
			}),
			readme,
		]
	});

	document.body.append(dialog);
	dialog.showModal();
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
				children: [createXIcon({ size: 18, fill: 'currentColor' })],
				events: { click: ({ target }) => target.closest('dialog').close() },
				aria: { label: 'Close' },
			})
		]
	});

	document.body.append(dialog);
	dialog.showModal();
});
