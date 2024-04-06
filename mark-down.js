import { parseMarkdown, parseMarkdownFile, registerLanguage, fetchMarkdown, STYLESHEETS } from '@shgysk8zer0/kazoo/markdown.js';
import { getCSSStyleSheet } from '@shgysk8zer0/kazoo/http.js';
import { whenIntersecting } from '@shgysk8zer0/kazoo/intersect.js';
import { callOnce } from '@shgysk8zer0/kazoo/utility.js';
import { getURL, setURL } from '@shgysk8zer0/kazoo/attrs.js';
import { createSlot, createElement } from '@shgysk8zer0/kazoo/elements.js';

const ghLightStyles = callOnce(() => getCSSStyleSheet(
	STYLESHEETS.github.light.href,
	{ media: STYLESHEETS.github.light.media },
));

const ghDarkStyles = callOnce(() => getCSSStyleSheet(
	STYLESHEETS.github.dark.href,
	{ media: STYLESHEETS.github.dark.media }
));

function ready() {
	const { resolve, promise } = Promise.withResolvers();

	if (document.readyState === 'complete') {
		resolve();
	} else {
		globalThis.addEventListener('load', () => resolve(), { once: true });
	}

	return promise;
}

const selfStyles = new CSSStyleSheet().replace(`
	:host {display: block; font-family: system-ui;}
	pre, table, thead, tbody, tr {max-width: 100%; overflow: auto;}
	img {max-width: 100%;}
	#body {padding: 0.7rem;}
	::slotted([slot="body"]) {display: none;}
`);

export class HTMLMarkDownElement extends HTMLElement {
	#shadow;
	#internals;

	static observedAttributes = ['src'];

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#internals = this.attachInternals();
		this.#internals.role = 'document';

		Promise.all([selfStyles, ghLightStyles(), ghDarkStyles()])
			.then(sheets => this.#shadow.adoptedStyleSheets = sheets);

		this.#shadow.append(
			createElement('header', {
				part: ['header'],
				children: [createSlot('header')],
			}),
			createElement('div', {
				id: 'body',
				part: ['body'],
			}),
			createSlot('content', {
				hidden: true,
				events: {
					slotchange: ({ target }) => {
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
					}
				}
			}),
			createElement('footer', {
				part: ['footer'],
				children: [createSlot('footer')],
			}),
		);
	}

	async attributeChangedCallback(name, oldVal, newVal) {
		if (name === 'src' && typeof newVal === 'string') {
			const frag = await fetchMarkdown(newVal);
			this.#shadow.getElementById('body').replaceChildren(frag);
		}
	}

	get src() {
		return getURL(this, 'src');
	}

	set src(val) {
		setURL(this, 'src', val);
	}

	async render(md, { base = document.baseURI } = {}) {
		await Promise.all([whenIntersecting(this), ready()]);
		const frag = await parseMarkdown(md, { base });
		this.#shadow.getElementById('body').replaceChildren(frag);
	}

	async renderFile(file, { base = document.baseURI } = {}) {
		await whenIntersecting(this);
		const frag = await parseMarkdownFile(file, { base });
		this.#shadow.getElementById('body').replaceChildren(frag);
	}

	static registerLanguage(name, def) {
		registerLanguage(name, def);
	}
}

customElements.define('mark-down', HTMLMarkDownElement);
