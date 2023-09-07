import { createElement, createInput, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createMailIcon, createDialogPasswordIcon, createSignInIcon, createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { errorToEvent } from '@shgysk8zer0/kazoo/utility.js';
import { HTMLFirebaseAuthElement, getAuth, disableOnSignIn, iconOptions } from './auth.js';
import { signInWithEmailAndPassword } from 'firebase/firebase-auth.js';

const protectedData = new WeakMap();

export class HTMLFirebaseSignInFormElement extends HTMLFirebaseAuthElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });
		const internals = this.attachInternals();

		shadow.append(createElement('form', {
			classList: ['system-ui'],
			events: {
				reset: () => {
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
						const { user } = await signInWithEmailAndPassword(auth, data.get('email'), data.get('password'));

						if (Object.is(user, null)) {
							throw new DOMException('There was an error signing in.');
						} else {
							this.dispatchEvent(new CustomEvent('success', { detail: { user }}));
						}
					} catch(err) {
						const errEvent = errorToEvent(err);
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
								createSlot('legend', { text: 'Sign-In' }),
							],
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'login-email',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('email-icon', { children: [createMailIcon(iconOptions)]}),
										createSlot('email-label', { text: 'Email' }),
									]
								}),
								createInput('email', {
									id: 'login-email',
									type: 'email',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'email',
									placeholder: 'user@example.com',
									required: true,
								}),
							]
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'login-password',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('password-icon', { children: [createDialogPasswordIcon(iconOptions)] }),
										createSlot('password-label', { text: 'Password' }),
									]
								}),
								createInput('password', {
									id: 'login-password',
									type: 'password',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'current-password',
									placeholder: '********',
									minlength: 8,
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
								createSlot('login-icon', { children: [createSignInIcon(iconOptions)] }),
								createSlot('login-label', { text: 'Sign-In' }),
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
		disableOnSignIn(this);
	}

	async connectedCallback() {
		super.connectedCallback();
		if ('credentials' in navigator && 'PasswordCredential' in globalThis) {
			await navigator.credentials.preventSilentAccess();
			const { id: email, password, name, iconURL } = await navigator.credentials.get({ password: true, required: true, silent: false });

			if  (typeof email  === 'string' && typeof password === 'string') {
				const auth = await getAuth();
				const user = await signInWithEmailAndPassword(auth, email, password);

				if (typeof user === 'object' && ! Object.is(user, null)) {
					this.dispatchEvent(new CustomEvent('success', { detail: { user }}));

					if (user.displayName !== name || user.photoURL !== iconURL) {
						const updated = new PasswordCredential({
							id: email,
							password,
							name: user.displayName,
							iconURL: user.photoURL,
						});

						navigator.credentials.store(updated).catch(console.error);
					}
				}
			}
		}
	}
}

customElements.define('firebase-sign-in', HTMLFirebaseSignInFormElement);
