import { use, parse } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { whenIntersecting } from '@shgysk8zer0/kazoo/intersect.js';
import { callOnce } from '@shgysk8zer0/kazoo/utility.js';
import { getURL, setURL } from '@shgysk8zer0/kazoo/attrs.js';

const ghLightStyles = callOnce(() => fetch(`https://unpkg.com/highlight.js@${hljs.versionString}/styles/github.css`, {
	headers: new Headers({ Accept: 'text/css' }),
	referrerPolicy: 'no-referrer',
}).then(async resp => {
	if (resp.ok) {
		const css = await resp.text();
		return new CSSStyleSheet({
			media: 'print, not (prefers-color-scheme: dark)',
			baseURL: resp.url,
		}).replace(css);
	} else {
		throw new Error(`${resp.url} [${resp.status} ${resp.statusText}]`);
	}
}));

const ghDarkStyles = callOnce(() => fetch(`https://unpkg.com/highlight.js@${hljs.versionString}/styles/github-dark.css`, {
	headers: new Headers({ Accept: 'text/css' }),
	referrerPolicy: 'no-referrer',
}).then(async resp => {
	if (resp.ok) {
		const css = await resp.text();
		return new CSSStyleSheet({
			media: 'screen and (prefers-color-scheme: dark)',
			baseURL: resp.url,
		}).replace(css);
	} else {
		throw new Error(`${resp.url} [${resp.status} ${resp.statusText}]`);
	}
}));

const selfStyles = new CSSStyleSheet().replace(`
	:host {display: block; font-family: system-ui;}
	pre, table, thead, tbody, tr {max-width: 100%; overflow: auto;}
	#body {padding: 0.7rem;}
	::slotted([slot="body"]) {display: none;}
`);

const allowElements = [
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'pre', 'code',
	'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'img', 'ol', 'ul', 'li', 'i', 'b', 'u',
	'strong', 'em', 'span', 'div', 'hr', 'br', 'sub', 'sup',
];

const allowAttributes = {
	'href': ['a'],
	'src': ['img'],
	'alt': ['img'],
	'id': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
	'class': ['*'],
};

use(markedHighlight({
	langPrefix: 'hljs language-',
	highlight(code, lang) {
		const language = hljs.getLanguage(lang) ? lang : 'plaintext';
		return hljs.highlight(code, { language }).value;
	}
}));

export class HTMLMarkDownElement extends HTMLElement {
	#shadow;
	#internals;

	static observedAttributes = ['src'];

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#internals = this.attachInternals();
		const header = document.createElement('header');
		const headerSlot = document.createElement('slot');
		const body = document.createElement('div');
		const content = document.createElement('slot');
		body.id = 'body';
		body.part.add('body');
		headerSlot.name = 'header';
		content.hidden = true;
		content.name = 'content';

		content.addEventListener('slotchange', ({ target }) => {
			const markdown = target.assignedElements()
				.map(el => {
					// Figure out indentation
					const match = /^(?:\n*)([\t ]*)/.exec(el.innerHTML);

					if (Array.isArray(match) && match.length !== 0) {
						const exp = new RegExp(`^[ \t]{1,${match.at(-1).length}}`, 'gm');
						return (el.tagName === 'TEMPLATE' ? el.content : el)
							.textContent.replaceAll(exp, '');
					} else {
						return (el.tagName === 'TEMPLATE' ? el.content : el)
							.textContent.replaceAll(/^[ \t]+/gm, '');
					}
				}).join('\n');

			this.render(markdown);
		});

		this.#internals.role = 'document';

		header.append(headerSlot);
		this.#shadow.append(header, body, content);

		Promise.all([selfStyles, ghLightStyles(), ghDarkStyles()])
			.then(sheets => this.#shadow.adoptedStyleSheets = sheets);
	}

	async attributeChangedCallback(name, oldVal, newVal) {
		if (name === 'src' && typeof newVal === 'string') {
			const resp = await fetch(this.src, {
				headers: new Headers({ Accept: 'text/markdown' }),
				referrerPolicy: 'no-referrer',
			});

			if (resp.ok) {
				const md = await resp.text();
				await this.render(md, { base: resp.url });
			} else {
				throw new Error(`${resp.url} [${resp.status} ${resp.statusText}]`);
			}
		}
	}

	get src() {
		return getURL(this, 'src');
	}

	set src(val) {
		setURL(this, 'src', val);
	}

	async render(md, { base = document.baseURI } = {}) {
		await whenIntersecting(this);
		const frag = await HTMLMarkDownElement.parse(md, { base });
		this.#shadow.getElementById('body').replaceChildren(frag);
	}

	static parse(str, { base = document.baseURI } = {}) {
		const { resolve, reject, promise } = Promise.withResolvers();

		requestIdleCallback(() => {
			try {
				const parsed = parse(str);
				const doc = Document.parseHTML(parsed, { allowElements, allowAttributes });
				const frag = document.createDocumentFragment();

				doc.querySelectorAll('img').forEach(img => {
					img.loading = 'lazy';
					img.crossOrigin = 'anonymous';
					img.referrerPolicy = 'no-referrer';
				});

				doc.querySelectorAll('a').forEach(a => {
					a.relList.add('external', 'noopener', 'noreferrer');
					a.href = new URL(a.getAttribute('href'), base);
				});

				frag.append(...doc.body.children);
				resolve(frag);
			} catch(e) {
				reject(e);
			}
		});

		return promise;
	}
}

customElements.define('mark-down', HTMLMarkDownElement);
