import { createElement } from '@shgysk8zer0/kazoo/elements.js';
import { on } from '@shgysk8zer0/kazoo/dom.js';
import { konami } from '@shgysk8zer0/konami';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { description as setDescription } from '@shgysk8zer0/kazoo/meta.js';
import { properties } from '@aegisjsproject/styles/properties.js';
import javascript from 'highlight.js/languages/javascript.min.js';
import xml from 'highlight.js/languages/xml.min.js';
import css from 'highlight.js/languages/css.min.js';

trustedTypes.createPolicy('default', {
	createHTML(input, policy) {
		const el = document.createElement('div');
		el.setHTML(input, policy);
		return el.innerHTML;
	}
});

document.adoptedStyleSheets = [properties];

customElements.whenDefined('mark-down').then(HTMLMarkDownElement => {
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
			new YouTubePlayer('dQw4w9WgXcQ', { controls: true, credentialless: true }),
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


customElements.whenDefined('photo-booth').then(async HTMLPhotoBoothElement => {
	const photoBooth = await HTMLPhotoBoothElement.loadFromURL('/test/test.json');
	document.getElementById('main').prepend(photoBooth);

	on('photo-booth', 'aftercapture', async (event) => {
		const dialog = document.createElement('dialog');
		const signal = AbortSignal.timeout(3000);
		const img = document.createElement('img');
		img.src = URL.createObjectURL(event.blob);
		img.crossOrigin = 'anonymous';
		dialog.append(img);
		dialog.addEventListener('close', ({ target }) => {
			target.remove();
			URL.revokeObjectURL(img.src);
		});

		dialog.addEventListener('click', ({ currentTarget }) => currentTarget.close(), { signal });

		signal.addEventListener('abort', () => {
			if (dialog.isConnected && dialog.open) {
				dialog.close();
			}
		}, { once: true });

		document.body.append(dialog);
		dialog.showModal();
	});
});

await customElements.whenDefined('event-signup').then(() => {
	const signup = document.getElementById('reg');

	signup.addEventListener('complete', ({ detail, target }) => {
		console.log(detail);
		target.reset();
	});

	signup.addEventListener('reset', ({ target }) => {
		target.hidePopover();
	});
});

// customElements.whenDefined('scroll-snap').then(async ScollSnap => {
// 	const scrollSnap = new ScollSnap();
// 	scrollSnap.type = 'inline';
// 	scrollSnap.popover = 'auto';
// 	scrollSnap.id = 'gallery';
// 	const imgs = Array.from(
// 		Iterator.range(1, 20, { inclusive: true }),
// 		// ['lzncruto-1fbmu7n.jpg', 'lzncxao6-qwf9uv.jpg', 'lzncxjx2-1y3gm1p.jpg', 'lzncxsjh-1narlm2.jpg', 'lznd68l5-uvhypb.jpg', 'lznd9pey-197sgr5.jpg', 'lzncwmn3-zotsql.jpg', 'lzncxidt-n37xxi.jpg', 'lzncxq81-jsqzyi.jpg', 'lzncxuv6-6hcsuf.jpg', 'lznd9htl-1hpuab1.jpg'],
// 		n => createImage(`https://picsum.photos/640/480?random=${n}`, {
// 			slot: 'child',
// 			alt: `Image ${n}`,
// 			width: 640,
// 			height: 480,
// 			loading: 'lazy',
// 			referrerPolicy: 'no-referrer',
// 		})
// 	);

// 	scrollSnap.append(...imgs);
// 	document.querySelector('.btn.next').addEventListener('click', scrollSnap.next.bind(scrollSnap), { passive: true });
// 	document.querySelector('.btn.prev').addEventListener('click', scrollSnap.prev.bind(scrollSnap), { passive: true });
// 	document.getElementById('main').prepend(scrollSnap);
// });

document.getElementById('camera').addEventListener('aftercapture', ({ blob }) => {
	document.getElementById('camera-roll')
		.addImage(blob)
		.then(img => URL.revokeObjectURL(img.src));
});
