import { HTMLFirebaseAuthElement, getAuth, iconOptions, styles } from '@shgysk8zer0/components/firebase/auth/auth.js';
import { createElement, createInput, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createMailIcon, createCheckIcon, createXIcon } from '@shgysk8zer0/kazoo/icons.js';
import { sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from 'firebase/firebase-auth.js';

const protectedData = new WeakMap();

export class HTMLFirebaseEmailLinkFormElement extends HTMLFirebaseAuthElement {
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
						await sendSignInLinkToEmail(auth, data.get('email'), {
							url: new URL('/', location.href).href,
							handleCodeInApp: true,
						});
						this.dispatchEvent(new Event('success'));
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
								createSlot('legend', { text: 'Sign-in via Email Link' }),
							],
						}),
						createElement('div', {
							classList: ['form-group'],
							children: [
								createElement('label', {
									for: 'email-link-email',
									classList: ['input-label', 'required'],
									part: ['label'],
									children: [
										createSlot('email-icon', { children: [createMailIcon(iconOptions)]}),
										createSlot('email-label', { text: 'Email' }),
									]
								}),
								createInput('email', {
									id: 'email-link-email',
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

	static async verify() {
		const auth = await getAuth();
		return isSignInWithEmailLink(auth, location.href);
	}

	static async signIn(email) {
		const auth = await getAuth();
		await signInWithEmailLink(auth, email, location.href);
	}
}

customElements.define('firebase-email-link', HTMLFirebaseEmailLinkFormElement);
