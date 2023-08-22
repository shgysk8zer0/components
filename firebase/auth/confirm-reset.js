import { createElement, createInput, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createLockIcon, createDialogPasswordIcon, createCheckIcon, createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { getString, setString } from '@shgysk8zer0/kazoo/attrs.js';
import { HTMLFirebaseAuthElement, getAuth, iconOptions, styles } from './auth.js';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/firebase-auth.js';

const protectedData = new WeakMap();

export class HTMLFirebaseConfirmResetFormElement extends HTMLFirebaseAuthElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });
		const internals = this.attachInternals();

		styles.then(sheets => shadow.adoptedStyleSheets = sheets);

		shadow.append(createElement('form', {
			classList: ['system-ui'],
			events: {
				submit: async event => {
					event.preventDefault();
					event.stopPropagation();
					const target = event.target;

					try {
						const data = new FormData(target);
						target.querySelectorAll('button, input').forEach(el => el.disabled = true);
						const auth = await getAuth();
						await confirmPasswordReset(auth, data.get('verification'), data.get('password'));
						this.dispatchEvent(new Event('success'));
					} catch(err) {
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
								createSlot('legend', { text: 'Confirm Password Reset' }),
							],
						}),
						createInput('email', { type: 'hidden', id: 'confirm-reset-email', readonly: true }),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'confirm-reset-verification',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('verification-icon', { children: [createLockIcon(iconOptions)]}),
										createSlot('verification-label', { text: 'Verification' }),
									]
								}),
								createInput('verification', {
									id: 'confirm-reset-verification',
									type: 'text',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'off',
									placeholder: '######',
									required: true,
									events: {
										change: async ({ target }) => {
											if (target.value.length !== 0) {
												try {
													const auth = await getAuth();
													const email = await verifyPasswordResetCode(auth, target.value);
													target.setCustomValidity('');
													target.readOnly = true;
													target.closest('.form-group').hidden = true;
													target.form.querySelector('#confirm-reset-email').value = email;
												} catch(err) {
													if (err.name === 'FirebaseError') {
														switch(err.code) {
															case 'auth/expired-action-code':
																target.setCustomValidity('Expired reset code');
																break;

															case 'auth/invalid-action-code':
																target.setCustomValidity('Invalid reset code');
																break;

															case 'auth/user-disabled':
																target.setCustomValidity('User account is disabled');
																break;

															case 'auth/user-not-found':
																target.setCustomValidity('User account not found');
																break;

															default:
																target.setCustomValidity('An unknown error occurred validating the reset code');
														}

														const error = new Error(target.validationMessage, { cause: err });
														const errEvent = new ErrorEvent('error', {
															error: error,
															message: error.message,
															filename: error.fileName,
															colno: error.columnNumber,
															lineno: error.lineNumber,
														});

														this.dispatchEvent(errEvent);
														const errMessage = target.form.querySelector('.error');
														errMessage.textContent = error.message;
														setTimeout(() => errMessage.replaceChildren(), 3000);
													} else {
														throw err;
													}
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
									for: 'confirm-reset-password',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('password-icon', { children: [createDialogPasswordIcon(iconOptions)]}),
										createSlot('password-label', { text: 'New Password' }),
									]
								}),
								createInput('password', {
									id: 'confirm-reset-password',
									type: 'password',
									classList: ['input'],
									part: ['input'],
									autocomplete: 'new-password',
									minlength: 8,
									placeholder: '********',
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
	}

	connectedCallback() {
		const params = new URLSearchParams(location.search);

		if (params.has(this.param)) {
			const { shadow } = protectedData.get(this);
			const input = shadow.getElementById('confirm-reset-verification');
			input.value = params.get(this.param);
			input.dispatchEvent(new Event('change'));
		}
	}

	get param() {
		return getString(this, 'param', { fallback: 'oobCode' });
	}

	set param(val) {
		setString(this, 'param', val);
	}
}

customElements.define('firebase-confirm-reset', HTMLFirebaseConfirmResetFormElement);
