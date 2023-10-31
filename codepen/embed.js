import { createIframe } from '@shgysk8zer0/kazoo/elements.js';
import { createPolicy } from '@shgysk8zer0/kazoo/trust.js';
import { getString, setString, getBool, setBool, getInt, setInt } from '@shgysk8zer0/kazoo/attrs.js';
const protectedData = new WeakMap();

const policy = createPolicy('codepen#script-url', {
	createScriptURL: input => input,
});

function render(el) {
	const { shadowRoot, user, pen, theme, loading, tab, height, editable, clickToLoad, credentialless } = el;
	const src = new URL(`https://codepen.io/${user}/embed${clickToLoad ? '/preview/' : '/'}${pen}`);

	src.searchParams.set('default-tab', tab);
	src.searchParams.set('theme-id', theme);
	
	if (editable) {
		src.searchParams.set('editable', 'true');
	}

	const iframe = createIframe(policy.createScriptURL(src.href), {
		loading, height, credentialless,
		sandbox: ['allow-scripts', 'allow-popups'],
		part: ['embed'],
	});

	iframe.allowTransparency = 'true';
	iframe.allowFullscreen = 'true';
	iframe.style.setProperty('width', '100%');

	shadowRoot.replaceChildren(iframe);
}
customElements.define('codepen-embed', class HTMLCodePenEmbedElement extends HTMLElement {
	constructor() {
		super();
		protectedData.set(this, { timeout: NaN });
		this.attachShadow({ mode: 'open' });
	}
	
	connectedCallback() {
		render(this);
		this.dispatchEvent(new Event('connected'));
	}
	
	attributeChangedCallback() {
		const { timeout } = protectedData.get(this);

		if (typeof timeout === 'number' && ! Number.isNaN(timeout)) {
			cancelAnimationFrame(timeout);
		}

		protectedData.set(this, {
			timeout: requestAnimationFrame(() => {
				render(this);
				protectedData.set(this, { timeout: NaN });
			})
		});
	}
	
	get clickToLoad() {
		return getBool(this, 'clicktoload');
	}
	
	set clickToLoad(val) {
		setBool(this, 'clicktoload', val);
	}
	
	get credentialless() {
		return this.hasAttribute('credentialless');
	}

	set credentialless(val) {
		this.toggleAttribute('credentialless', val);
	}

	get editable() {
		return getBool(this, 'editable');
	}
	
	set editable(val) {
		setBool(this, 'editable', val);
	}
	
	get height() {
		return getInt(this, 'height', { fallback: 300 });
	}
	
	set height(val) {
		setInt(this, 'height', val, { min: 0 });
	}
	
	get loading() {
		return getString(this, 'loading', { fallback: 'lazy' });
	}
	
	set loading(val) {
		setString(this, 'loading', val);
	}
	
	get pen() {
		return getString(this, 'pen');
	}
	
	set pen(val) {
		setString(this, 'pen', val);
	}
	
	get tab() {
		return getString(this, 'tab', { fallback: 'result' });
	}
	
	set tab(val) {
		setString(this, 'tab', val);
	}
	
	get theme() {
		return getString(this, 'theme', { fallback: 'default' });
	}
	
	set theme(val) {
		setString(this, 'theme', val);
	}
	
	get user() {
		return getString(this, 'user');
	}
	
	set user(val) {
		setString(this, 'user', val);
	}
	
	static get observedAttributes() {
		return ['user', 'pen', 'tab', 'editable', 'height', 'theme', 'loading'];
	}
	
	static getPen({ user, pen, tab = 'result', editable = false, theme = 'default', loading = 'lazy', clickToLoad = false, height = 300, credentialless = true }) {
		const el = new HTMLCodePenEmbedElement();
		el.credentialless = credentialless;
		el.loading = loading;
		el.user = user;
		el.pen = pen;
		el.tab = tab;
		el.editable = editable;
		el.theme = theme;
		el.clickToLoad = clickToLoad;
		el.height = height;
		
		return el;
	}
});
