import { createElement, createInput, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createMailIcon, createDialogPasswordIcon, createSignUpIcon, createXIcon, createPersonIcon } from '@shgysk8zer0/kazoo/icons.js';
import { errorToEvent } from '@shgysk8zer0/kazoo/utility.js';
import { HTMLFirebaseAuthElement, getAuth, iconOptions } from './auth.js';
import { updateProfile } from 'firebase/firebase-auth.js';

const protectedData = new WeakMap();

export class HTMLFirebaseUpdateProfileFormElement extends HTMLFirebaseAuthElement {
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
						target.querySelectorAll('button, input').forEach(el => el.disabled = true);
						const { currentUser } = await getAuth();

						if (Object.is(currentUser, null)) {
							throw new DOMException('You must be signed in.');
						} else {
							await updateProfile(currentUser, {
								displayName: data.get('name'),
							});

							this.dispatchEvent(new CustomEvent('success', { detail: currentUser }));
						}
					} catch(err) {
						const errEvent = errorToEvent('error', err);
						this.dispatchEvent(errEvent);
					} finally {
						target.querySelectorAll('button, input').forEach(el => el.disabled = false);
					}
				}
			},
			children: [
				createElement('fieldset', {
					classList: ['no-border'],
					children: [
						createElement('legend', {
							children: [
								createSlot('legend', { text: 'Sign-Up' }),
							],
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'register-name',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('name-icon', { children: [createPersonIcon(iconOptions)]}),
										createSlot('name-label', { text: 'Name' }),
									]
								}),
								createInput('name', {
									id: 'register-name',
									type: 'text',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'name',
									placeholder: 'Firstname Lastname',
									required: true,
								}),
							]
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'register-email',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('email-icon', { children: [createMailIcon(iconOptions)] }),
										createSlot('email-label', { text: 'Email' }),
									]
								}),
								createInput('email', {
									id: 'register-email',
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
									for: 'register-password',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('password-icon', { children: [createDialogPasswordIcon(iconOptions)] }),
										createSlot('password-label', { text: 'Password' }),
									]
								}),
								createInput('password', {
									id: 'register-password',
									type: 'password',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'new-password',
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
							children: [
								createSlot('register-icon', { children: [createSignUpIcon(iconOptions)] }),
								createSlot('register-label', { text: 'Sign-Up' }),
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
	}
}

customElements.define('firebase-update-profile', HTMLFirebaseUpdateProfileFormElement);
