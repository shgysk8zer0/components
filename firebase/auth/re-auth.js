import { createElement, createInput, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createMailIcon, createDialogPasswordIcon, createSignInIcon, createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { errorToEvent } from '@shgysk8zer0/kazoo/utility.js';
import { HTMLFirebaseAuthElement, getAuth, isUser, disableOnSignOut, iconOptions } from './auth.js';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/firebase-auth.js';

const protectedData = new WeakMap();

export class HTMLFirebaseReAuthFormElement extends HTMLFirebaseAuthElement {
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
						await HTMLFirebaseReAuthFormElement.reauthenticate(auth, data.get('password'));
						this.dispatchEvent(new Event('success'));
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
									id: 're-auth-email',
									type: 'email',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'email',
									placeholder: 'user@example.com',
									readOnly: true,
								}),
							]
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 're-auth-password',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('password-icon', { children: [createDialogPasswordIcon(iconOptions)] }),
										createSlot('password-label', { text: 'Password' }),
									]
								}),
								createInput('password', {
									id: 're-auth-password',
									type: 'password',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'current-password',
									placeholder: '********',
									minlength: 8,
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
								createSlot('submit-icon', { children: [createSignInIcon(iconOptions)] }),
								createSlot('submit-label', { text: 'Sign-In' }),
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

	async connectedCallback() {
		const { currentUser } = await getAuth();

		if (isUser(currentUser)) {
			const { shadow } = protectedData.get(this);
			const input = shadow.getElementById('re-auth-email');
			input.value = currentUser.email;
		}
	}

	static async reauthenticate(auth, password) {
		if (! isUser(auth.currentUser)) {
			throw new DOMException('User is not signed-in.');
		} else if (typeof password !== 'string') {
			throw new TypeError('Missing or invalid password.');
		} else {
			const cred = EmailAuthProvider.credential(auth.currentUser.email, password);
			await reauthenticateWithCredential(auth.currentUser, cred);
		}
	}
}

customElements.define('firebase-re-auth', HTMLFirebaseReAuthFormElement);
