import { HTMLFirebaseAuthElement, getAuth, iconOptions, styles } from '@shgysk8zer0/components/firebase/auth/auth.js';
import { createElement, createInput, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createMailIcon, createDialogPasswordIcon, createCheckIcon, createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/firebase-auth.js';

const protectedData = new WeakMap();

export class HTMLFirebaseChangeEmailFormElement extends HTMLFirebaseAuthElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });
		const internals = this.attachInternals();

		styles.then(sheets => shadow.adoptedStyleSheets = sheets);

		shadow.append(createElement('form', {
			classList: ['system-ui'],
			events: {
				reset: () => this.dispatchEvent(new Event('abort')),
				submit: async event => {
					event.preventDefault();
					event.stopPropagation();
					const target = event.target;

					try {
						const data = new FormData(target);
						target.querySelectorAll('button, input').forEach(el => el.disabled = true);
						const auth = await getAuth();

						if (typeof auth.currentUser === 'object' && ! Object.is(auth.currentUser, null)) {
							await updateEmail(auth.currentUser, data.get('newPassword'));
							this.dispatchEvent(new Event('success'));
						} else {
							throw new Error('You must be logged in.');
						}
					} catch(err) {
						console.error(err);
						const errEvent = new ErrorEvent('error', {
							error: err,
							message: err.message,
							filename: err.fileName,
							colno: err.columnNumber,
							lineno: err.lineNumber,
						});

						this.dispatchEvent(errEvent);
						const errMessage = target.querySelector('.error');
						errMessage.textContent = err.message;
						setTimeout(() => errMessage.replaceChildren(), 3000);
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
								createSlot('legend', { text: 'Change Password' }),
							],
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'email-change-old-email',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('email-icon', { children: [createMailIcon(iconOptions)]}),
										createSlot('email-label', { text: 'Email' }),
									]
								}),
								createInput('email', {
									id: 'email-change-old-email',
									type: 'email',
									classList: ['input'],
									autocomplete: 'email',
								}),
							]
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'change-password-old',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('password-old-icon', { children: [createDialogPasswordIcon(iconOptions)]}),
										createSlot('password-old-label', { text: 'Old Password' }),
									]
								}),
								createInput('oldPassword', {
									id: 'change-password-old',
									type: 'password',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'current-password',
									placeholder: '**********',
									minlength: 8,
									required: true,
									events: {
										change: async ({ target }) => {
											if  (target.value.length >= target.minLength) {
												try {
													const { currentUser } = await getAuth();
													const cred = EmailAuthProvider.credential(currentUser.email, target.value);
													await reauthenticateWithCredential(currentUser, cred);
													target.setCustomValidity('');
												} catch(err) {
													console.error(err);
													target.setCustomValidity(err.message);
													const errEvent = new ErrorEvent('error', {
														error: err,
														message: err.message,
														filename: err.fileName,
														colno: err.columnNumber,
														lineno: err.lineNumber,
													});

													this.dispatchEvent(errEvent);
													const errMessage = target.querySelector('.error');
													errMessage.textContent = err.message;
													setTimeout(() => errMessage.replaceChildren(), 3000);
												}
											}
										}
									}
								}),
							]
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'change-password-new',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('password-new-icon', { children: [createDialogPasswordIcon(iconOptions)]}),
										createSlot('password-new-label', { text: 'New Password' }),
									]
								}),
								createInput('newPassword', {
									id: 'change-password-new',
									type: 'password',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'new-password',
									placeholder: '**********',
									required: true,
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
								createSlot('submit-icon', { children: [createCheckIcon(iconOptions)] }),
								createSlot('submit-label', { text: 'Submit' }),
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

	async connectedCallback() {
		const { currentUser } = await getAuth();
		const { shadow } = protectedData.get(this);
		shadow.getElementById('change-password-email').value = currentUser.email;
	}
}

customElements.define('firebase-change-email', HTMLFirebaseChangeEmailFormElement);
