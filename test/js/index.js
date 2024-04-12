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

on('window-controls form', 'submit', event => {
	event.preventDefault();
	const data = new FormData(event.target);
	const match = document.getElementById(data.get('search'));

	if (match instanceof Element && ! match.hidden) {
		match.scrollIntoView({ behavior: 'smooth', block: 'end' });
	} else {
		const popover = document.createElement('div');
		popover.popover = 'auto';
		popover.textContent = `No results for \`#${data.get('search')}\`.`;
		popover.addEventListener('toggle', ({ target, newState }) => {
			if (newState === 'closed') {
				target.remove();
			}
		});

		document.body.append(popover);
		popover.showPopover();
		setTimeout(() => popover.hidePopover(), 3000);
	}
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

const ignored = new Set(['els-list', 'search-fallback', 'spotify-player']);

document.getElementById('els-list').append(...Array.from(
	document.querySelectorAll('[id]'),
	({ id }) => {
		if (! ignored.has(id)) {
			const option = document.createElement('option');
			option.label = id;
			option.value = id;
			return option;
		}
	}
).filter(opt => opt instanceof HTMLOptionElement));

document.querySelectorAll('window-controls [disabled]').forEach(el => el.disabled = false);
