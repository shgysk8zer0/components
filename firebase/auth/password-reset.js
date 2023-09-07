import { createElement, createInput, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createMailIcon, createCheckIcon, createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { getString, setString } from '@shgysk8zer0/kazoo/attrs.js';
import { errorToEvent } from '@shgysk8zer0/kazoo/utility.js';
import { HTMLFirebaseAuthElement, getAuth, disableOnSignOut, iconOptions } from './auth.js';
import { sendPasswordResetEmail } from 'firebase/firebase-auth.js';

const protectedData = new WeakMap();

function generateResetURL(path = location.pathname) {
	const url = new URL(path, location.origin);

	if (url.origin !== location.origin) {
		throw new DOMException('Invalid cross-origin URL for password reset.');
	} else if (url.search.length !== 0) {
		throw new DOMException('Path must not contain any query string.');
	} else {
		return url.href;
	}
}

export class HTMLFirebasePasswordResetFormElement extends HTMLFirebaseAuthElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });
		const internals = this.attachInternals();

		shadow.append(createElement('form', {
			classList: ['system-ui'],
			events: {
				reset: event => {
					event.stopPropagation();
					this.dispatchEvent(new Event('abort'));
				},
				submit: async event => {
					event.preventDefault();
					event.stopPropagation();
					const target = event.target;

					try {
						const data = new FormData(target);
						this.disabled = true;
						const auth = await getAuth();
						// @TODO Get additional info from webapp manifest
						const actionCodeSettings = {
							url: generateResetURL(this.path),
							handleCodeInApp: false,
						};

						await sendPasswordResetEmail(auth, data.get('email'), actionCodeSettings);
						this.dispatchEvent(new Event('success'));
					} catch(err) {
						const errEvent = errorToEvent('error', err);
						this.dispatchEvent(errEvent);
					} finally {
						this.disabled = false;
					}
				}
			},
			children: [
				createElement('fieldset', {
					classList: ['no-border'],
					children: [
						createElement('legend', {
							children: [
								createSlot('legend', { text: 'Reset Your Password' }),
							],
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'forgot-password-email',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('email-icon', { children: [createMailIcon(iconOptions)]}),
										createSlot('email-label', { text: 'Email' }),
									]
								}),
								createInput('email', {
									id: 'forgot-password-email',
									type: 'email',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'email',
									placeholder: 'user@example.com',
									required: true,
								}),
							]
						}),
					]
				}),
				createElement('div', {
					classList: ['status-box', 'error'],
					part: ['error'],
				}),
				createElement('div', {
					classList: ['flex', 'row', 'space-evenly'],
					children: [
						createElement('button', {
							type: 'submit',
							classList: ['btn', 'btn-accept'],
							part: ['btn'],
							// disabled: true,
							children: [
								createSlot('register-icon', { children: [createCheckIcon(iconOptions)] }),
								createSlot('register-label', { text: 'Submit' }),
							],
						}),
						createElement('button', {
							type: 'reset',
							classList: ['btn', 'btn-reject'],
							part: ['btn'],
							children: [
								createSlot('cancel-icon', { children: [createXIcon(iconOptions)] }),
								createSlot('cancel-label', { text: 'Cancel' }),
							],
						}),
					]
				}),
				createSlot('footer'),
			]
		}));

		protectedData.set(this, { shadow, internals });
		disableOnSignOut(this);
	}

	get path() {
		return getString(this, 'path', { fallback: location.pathname });
	}

	set path(val) {
		setString(this, 'path', val);
	}
}

customElements.define('firebase-password-reset', HTMLFirebasePasswordResetFormElement);
