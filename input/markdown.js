import { HTMLCustomInputElement } from './custom.js';
import { parseMarkdown, STYLESHEETS } from '@shgysk8zer0/kazoo/markdown.js';
import { createElement, createLink } from '@shgysk8zer0/kazoo/elements.js';
import * as gnomePalette from '@shgysk8zer0/jss/palette/gnome.js';

const sheets = new Map();

async function getStyleSheet(src, { media } = {}) {
	if (sheets.has(src)) {
		return sheets.get(src);
	} else {
		const resp = await fetch(src, {
			headers: new Headers({ Accept: 'text/css' }),
		});

		if (resp.ok) {
			const css = await resp.text();
			const sheet = await new CSSStyleSheet({ media }).replace(css);
			sheets.set(src, sheet);
			return sheet;
		}
	}
}


const ids = {
	composePanel: 'compose-panel',
	previewPanel: 'preview-panel',
	composeTab: 'compose-tab',
	previewTab: 'preview-tab',
};

function setActiveTab(tab) {
	const tablist = tab.closest('[role="tablist"]');
	const root = tab.getRootNode();
	const tabs = tablist.querySelectorAll('[role="tab"]');

	tabs.forEach(el => {
		const panel = root.getElementById(el.getAttribute('aria-controls'));

		if (el.isSameNode(tab)) {
			el.setAttribute('aria-selected', 'true');
			el.disabled = true;
			panel.classList.add('active');
		} else {
			el.setAttribute('aria-selected', 'false');
			el.disabled = false;
			panel.classList.remove('active');
		}
	});
}

const sheet = new CSSStyleSheet().replace(`
	:host {
		display: block;
		border: 1px solid #dadada;
		border-radius: 6px;
		min-height: 8em;
	}
	.panel {
		height: 100%;
		display: none;
	}
	.panel.active {
		display: block;
		height: max-content;
	}
	.btn {
		background-color: ${gnomePalette.blue[3]};
		color: ${gnomePalette.light[1]};
		transition: background-color 300ms;
	}

	.btn:hover, .btn:active {
		background-color: ${gnomePalette.blue[4]};
	}
`);

class HTMLMarkdownInputElement extends HTMLCustomInputElement {
	#shadow;
	#internals;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#internals = this.attachInternals();

		Promise.all([
			sheet,
			getStyleSheet(STYLESHEETS.github.light.href, { media: STYLESHEETS.github.light.media }),
			getStyleSheet(STYLESHEETS.github.dark.href, { media: STYLESHEETS.github.dark.media }),
		]).then(sheets => this.#shadow.adoptedStyleSheets = sheets);

		this.#shadow.append(
			createLink(STYLESHEETS.github.light.href, {
				rel: 'stylesheet',
				media: STYLESHEETS.github.light.media,
				crossOrigin: 'anonymous',
				referrerPolicy: 'no-referrer',
			}),
			createLink(STYLESHEETS.github.dark.href, {
				rel: 'stylesheet',
				media: STYLESHEETS.github.dark.media,
				crossOrigin: 'anonymous',
				referrerPolicy: 'no-referrer',
			}),
			createElement('nav', {
				role: 'tablist',
				part: ['tablist'],
				classList: ['sticky', 'top', 'tablist'],
				children: [
					createElement('button', {
						type: 'button',
						role: 'tab',
						id: ids.composeTab,
						disabled: true,
						part: ['tab'],
						'aria-controls': ids.composePanel,
						'aria-selected': 'false',
						classList: ['btn', 'btn-default'],
						text: 'Compose',
						events: {
							click: ({ currentTarget }) => setActiveTab(currentTarget),
						}
					}),
					createElement('button', {
						type: 'button',
						role: 'tab',
						id: ids.previewTab,
						part: ['tab'],
						'aria-controls': ids.previewPanel,
						'aria-selected': true,
						classList: ['btn', 'btn-default'],
						dataset: { panel: 'preview' },
						text: 'Preview',
						events: {
							click: async ({ currentTarget }) => {
								try {
									const composePanel = this.#shadow.getElementById(ids.composePanel);
									const previewPanel = this.#shadow.getElementById(ids.previewPanel);
									const html = await parseMarkdown(composePanel.innerText);
									previewPanel.replaceChildren(html);
								} catch(err) {
									console.error(err);
								} finally {
									setActiveTab(currentTarget);
								}
							},
						}
					}),
				]
			}),
			createElement('div', {
				id: ids.composePanel,
				part: ['panel'],
				classList: ['panel', 'compose', 'active'],
				role: 'tabpanel',
				contenteditable: 'true',
				events: {
					input: async ({ currentTarget }) => {
						const markdown = currentTarget.innerText;
						this.#internals.setFormValue(markdown, markdown);

						if (this.required && markdown.length === 0) {
							this.#internals.setValidity({
								valueMissing: true,
							}, 'This is a required field', currentTarget);
						} else if (this.hasAttribute('minlength') && markdown.length < this.minLength) {
							this.#internals.setValidity({
								tooShort: true,
							}, `Input must contain at least ${this.minLength} characters`, currentTarget);
						} else if (this.hasAttribute('maxlength') && markdown.length > this.maxLength) {
							this.#internals.setValidity({
								tooShort: true,
							}, `Input must contain no more than ${this.maxLength} characters`, currentTarget);
						} else {
							try {
								const html = await parseMarkdown(markdown);
								this.#shadow.getElementById(ids.previewPanel).replaceChildren(html);
								this.#internals.setValidity({}, '');
							} catch(err) {
								console.error(err);
								this.#internals.setValidity({
									badInput: true,
								}, 'Invalid Markdown Syntax', currentTarget);
							}
						}
					}
				}
			}),
			createElement('div', {
				id: ids.previewPanel,
				part: ['panel'],
				classList: ['panel', 'preview'],
				role: 'tabpanel',
			}),
		);
	}

	formAssociatedCallback(form) {
		if (super.formAssociatedCallback instanceof Function) {
			super.formAssociatedCallback(form);
		}

		this.labels.forEach(label => label.addEventListener('click', () => {
			setActiveTab(this.#shadow.getElementById(ids.composeTab));
			requestAnimationFrame(() => this.#shadow.getElementById(ids.composePanel).focus());
		}));
	}

	formResetCallback() {
		this.#shadow.getElementById(ids.composePanel).replaceChildren();
		this.#shadow.getElementById(ids.previewPanel).replaceChildren();
		setActiveTab(this.#shadow.getElementById(ids.composeTab));
	}

	formDisabledCallback(disabled) {
		super.formDisabledCallback(disabled);
		const contentEditable = disabled ? 'false' : 'true';
		this.#shadow.getElementById(ids.composePanel).setAttribute('contenteditable', contentEditable);
	}

	async formStateRestoreCallback(state, mode) {
		console.log(state, mode);
		this.#shadow.getElementById(ids.composePanel).innerText = state;
		const parsed = await parseMarkdown(state);
		this.#shadow.getElementById(ids.previewPanel).replaceChildren(parsed);
	}
}

customElements.define('markdown-input', HTMLMarkdownInputElement);
