import { text, attr, remove } from '@shgysk8zer0/kazoo/dom.js';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { getString, setString, getBool, setBool } from '@shgysk8zer0/kazoo/attrs.js';
import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { createDeprecatedPolicy } from '../trust.js';
import template from './user.html.js';
import styles from './user.css.js';

createDeprecatedPolicy('github-user#html');

const ENDPOINT = 'https://api.github.com';

async function getUser(user) {
	const key = `github-user-${user}`;

	if (sessionStorage.hasOwnProperty(key)) {
		return JSON.parse(sessionStorage.getItem(key));
	} else {
		const data = await getJSON(new URL(`/users/${user}`, ENDPOINT));
		sessionStorage.setItem(key, JSON.stringify(data));
		return data;
	}
}

registerCustomElement('github-user', class HTMLGitHubUserElement extends HTMLElement {
	constructor(user = null) {
		super();

		const shadow = this.attachShadow({ mode: 'open' });
		// const internals = this.attachInternals();
		shadow.append(template.cloneNode(true));
		shadow.adoptedStyleSheets = [styles];
		this.dispatchEvent(new Event('ready'));
		// internals.states.add('--loading');

		Promise.resolve().then(() => {
			if (typeof user === 'string') {
				this.user = user;
			}
		});
	}

	get ready() {
		return Promise.resolve();
	}

	get whenConnected() {
		const { promise, resolve } = Promise.withResolvers();
		if (this.isConnected) {
			resolve();
		} else {
			this.addEventListener('connected', () => resolve(), { once: true });
		}

		return promise;
	}

	get bio() {
		return getBool(this, 'bio');
	}

	set bio(val) {
		setBool(this, 'bio', val);
	}

	get user() {
		return getString(this, 'user');
	}

	set user(val) {
		setString(this, 'user', val);
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'user':
				if (typeof newVal === 'string' && newVal.length !== 0) {
					Promise.all([
						getUser(newVal),
						this.whenConnected,
					]).then(async ([user]) => {
						try {
							const base = this.shadowRoot;

							attr('[part~="avatar"]', {
								src: `${user.avatar_url}&s=64`,
								height: 64,
								width: 64,
							}, { base });

							text('[part~="username"]', user.login, { base });
							text('[part~="name"]', user.name, { base });
							attr('[part~="github"]', {
								href: user.html_url,
								title: `View ${user.login}'s profile on GitHub`,
							}, { base });

							if (user.bio !== null) {
								text('[part~="bio"]', user.bio, { base });
								attr('[part~="bio"]', { hidden: false }, { base });
							} else {
								attr('[part~="bio"]', { hidden: true }, { base });
							}

							if (user.location !== null) {
								text('[part~="location"]', user.location, { base });
								attr('[part~="location-container"]', { hidden: false }, { base });
							} else {
								attr('[part~="location-container"]', { hidden: true }, { base });
							}

							if (user.email !== null) {
								text('[part~="email"]', user.email, { base });
								attr('[part~="email"]',{ href: `mailto:${user.email}`}, { base });
								attr('[part~="email-container"]', { hidden: false }, { base });
							} else {
								attr('[part~="email-container"]', { hidden: true }, { base });
							}

							if (typeof user.company === 'string') {
								text('[part~="company"]', user.company, { base });
								attr('[part~="company"]', {
									href: `https://github.com/${user.company.replace('@', '')}`,
								}, { base });
								attr('[part~="company-container"]', { hidden: false }, { base });
							} else {
								attr('[part~="company-container"]', { hidden: true }, { base });
							}

							if (typeof user.blog === 'string' && user.blog.length !== 0) {
								const blog = new URL(user.blog);
								attr('[part~="blog"]', { href: blog.href }, { base });
								text('[part~="blog"]', blog.hostname, { base });
							} else {
								remove('[part~="blog-container"]', { base });
							}
						} catch(err) {
							console.error(err);
							this.hidden = true;
						}
					});
				}
				break;
		}
	}

	connectedCallback() {
		this.dispatchEvent(new Event('connected'));
	}

	static get observedAttributes() {
		return [
			'user',
		];
	}
});
