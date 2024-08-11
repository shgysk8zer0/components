customElements.define('style-sheet', class HTMLStyleSheetElement extends HTMLElement {
	#sheet = null;
	#parent = null;
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });

		new CSSStyleSheet().replace(':host {display: none;}')
			.then(sheet => this.#shadow.adoptedStyleSheets = [sheet]);
	}

	connectedCallback() {
		const slot = document.createElement('slot');
		this.#createSheet();

		slot.addEventListener('slotchange', () => this.#updateStyles(this.#sheet), { passive: true });

		this.#shadow.replaceChildren(slot);
		this.hidden = true;
		this.#parent = this.#getParent();
		this.#connect();
	}

	disconnectedCallback() {
		this.#disconnect();
		this.#parent = null;
		this.#sheet.disabled = true;
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (this.isConnected && this.#sheet instanceof CSSStyleSheet) {
			switch (name) {
				case 'disabled':
					this.#sheet.disabled = typeof newVal === 'string';
					break;

				case 'media':
					this.#sheet.media.mediaText = typeof newVal === 'string' ? newVal : null;
					break;

				case 'baseurl':
					// Cannot change the `baseURL` of an existing sheet
					this.#disconnect();
					this.#createSheet();
					this.#connect();
					break;
			}
		}
	}

	[Symbol.toStringTag]() {
		return 'HTMLStyleSheetElement';
	}

	*[Symbol.iterator]() {
		if (this.#sheet instanceof CSSStyleSheet) {
			for (const rule of this.#sheet.cssRules) {
				yield rule;
			}
		}
	}

	toString() {
		return this.textContent;
	}

	toJSON() {
		return this.textContent;
	}

	get baseURL() {
		if (this.hasAttribute('baseurl')) {
			return URL.parse(this.getAttribute('baseurl'), document.baseURI) ?? new URL(document.baseURI);
		} else {
			return new URL(document.baseURI);
		}
	}

	set baseURL(val) {
		if (val instanceof URL) {
			this.setAttribute('baseurl', val.href);
		} else if (typeof val === 'string' && val.length !== 0) {
			this.setAttribute('baseurl', val);
		} else {
			this.removeAttribute('baseurl');
		}
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(val) {
		this.toggleAttribute('disabled', val);
	}

	get media() {
		if (this.hasAttribute('media')) {
			return this.getAttribute('media');
		} else {
			return undefined;
		}
	}

	set media(val) {
		if (val instanceof MediaQueryList) {
			this.setAttribute('media', val.media);
		} else if (typeof val === 'string' && val.length !== 0) {
			this.setAttribute('media', val);
		} else {
			this.removeAttribute('media');
		}
	}

	get sheet() {
		return this.#sheet;
	}

	get blob() {
		return new Blob([this.textContent], { type: 'text/css' });
	}

	get blobURI() {
		return URL.createObjectURL(this.blob);
	}

	get dataURI() {
		return `data:text/css,${encodeURIComponent(this.textContent)}`;
	}

	get link() {
		const link = document.createElement('link');
		link.relList.add('stylesheet');
		link.media = this.media;
		link.disabled = this.disabled;
		link.crossOrigin = 'anonymous';
		link.referrerPolicy = 'no-referrer';
		link.href = this.blobURI;
		return link;
	}

	get style() {
		const style = document.createElement('style');
		style.media = this.media;
		style.disabled = this.disabled;
		style.textContent = this.textContent;
		return style;
	}

	#getParent() {
		if (!this.isConnected) {
			return null;
		} else if (this.parentNode instanceof ShadowRoot) {
			return this.parentNode;
		} else if (this.parentElement instanceof HTMLElement && this.parentElement.shadowRoot instanceof ShadowRoot) {
			return this.parentElement.shadowRoot;
		} else if (this.parentElement instanceof HTMLBodyElement || this.parentElement instanceof HTMLHeadElement) {
			return this.ownerDocument;
		} else {
			return null;
		}
	}

	#createSheet() {
		const sheet = new CSSStyleSheet({
			media: this.media,
			baseURL: this.baseURL,
			disabled: this.disabled,
		});

		if (this.#sheet instanceof CSSStyleSheet) {
			for (const rule of this.#sheet.cssRules) {
				sheet.insertRule(rule.cssText);
			}
		} else {
			this.#updateStyles(sheet);
		}

		this.#sheet = sheet;
	}

	#connect() {
		if (this.#parent instanceof Node) {
			this.#parent.adoptedStyleSheets = [...this.#parent.adoptedStyleSheets ?? [], this.#sheet];
		}
	}

	#disconnect() {
		if (this.#parent instanceof Node && Array.isArray(this.#parent.adoptedStyleSheets)) {
			this.#parent.adoptedStyleSheets = this.#parent.adoptedStyleSheets.filter(sheet => sheet !== this.#sheet);
		}
	}

	async #updateStyles(sheet) {
		await sheet.replace(this.textContent).catch(error => {
			this.dispatchEvent(new ErrorEvent('error', {
				message: error.message,
				filename: error.fileName,
				lineno: error.lineNumber,
				colno: error.columnNumber,
				error: error,
			}));
		});
	}

	static get observedAttributes() {
		return ['media', 'disabled', 'baseurl'];
	}

	static create(css, { media, disabled = false, baseURL = document.baseURI } = {}) {
		const sheet = new HTMLStyleSheetElement();

		if (typeof media !== 'undefined') {
			sheet.media = media;
		}

		if (disabled) {
			sheet.disabled = true;
		}

		if (typeof baseURL !== 'undefined') {
			sheet.baseURL = baseURL;
		}

		sheet.textContent = css;

		return sheet;
	}
});
