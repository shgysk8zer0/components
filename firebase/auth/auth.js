import {
	onAuthStateChanged, getAuth as getDefaultAuth, signOut as logOut,
	reauthenticateWithCredential, EmailAuthProvider,
} from 'firebase/firebase-auth.js';

import { getString, setString, getBool, setBool } from '@shgysk8zer0/kazoo/attrs.js';
import { createElement, createInput, createSlot } from '@shgysk8zer0/kazoo/elements.js';
import { createMailIcon, createDialogPasswordIcon } from '@shgysk8zer0/kazoo/icons.js';
import {
	formStyles, btnStyles, hostStyles, fonts, flexStyles, cursorStyles,
	commonStyles, displayRules,
} from '@shgysk8zer0/jss/common.js';

const initializedDeferred = Promise.withResolvers();
const authReadyDeferred = Promise.withResolvers();
let initialized = false;
const instances = new Set();
const symbols = {
	internals: Symbol('firebase-internals'),
	shadow: Symbol('firebase-shadow'),
};

const capturedEvents = [
	'keydown',  'keyup', 'keypress', 'paste', 'cut', 'copy', 'input', 'beforeinput',
	'change', 'compositionstart', 'compositionupdate', 'compositionend', 'invalid',
];

const captureEvent = event => event.stopPropagation();

export const iconOptions = { height: 18, width: 18, fill: 'currentColor', part: ['icon'], classList: ['icon'] };
export const styles = Promise.all([
	formStyles, btnStyles, hostStyles, fonts, flexStyles, cursorStyles,
	commonStyles, displayRules,
]);

export class HTMLFirebaseAuthElement extends HTMLElement {
	// #shadow;
	// #internals;

	static observedAttributes = ['disabled'];

	constructor() {
		super();

		Object.defineProperties(this, {
			[symbols.internals]: {
				value: null,
				enumerable: false,
				writable: true,
				configurable: false,
			},
			[symbols.shadow]: {
				value: null,
				enumerable: false,
				writable: true,
				configurable: false,
			},
		});

		this.addEventListener('error', err => {
			const errMessage = this[symbols.shadow].querySelector('.error');
			errMessage.textContent = err.message;
			setTimeout(() => errMessage.textContent = '',  5000);
		});
	}

	connectedCallback() {
		instances.add(this);
	}

	disconnectedCallback() {
		instances.delete(this);
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'disabled':
				if (typeof newVal === 'string') {
					this[symbols.shadow].querySelectorAll('button:not([type="reset"]), input, select, fieldset')
						.forEach(el => el.disabled = true);
					this.tabIndex = -1;
					this[symbols.internals].states.add('--disabled');
					this[symbols.internals].ariaDisabled = 'true';
				} else {
					this[symbols.shadow].querySelectorAll('button, input, select, fieldset')
						.forEach(el => el.disabled = false);
					this.removeAttribute('tabindex');
					this[symbols.internals].states.delete('--disabled');
					this[symbols.internals].ariaDisabled = 'false';
				}
		}
	}

	attachShadow({ mode = 'closed' } = {}) {
		const shadow = super.attachShadow({ mode });

		capturedEvents.forEach(ev => shadow.addEventListener(ev, captureEvent, { capture: true }));
		this[symbols.shadow] = shadow;
		styles.then(sheets => shadow.adoptedStyleSheets = sheets);
		return shadow;
	}

	attachInternals() {
		const internals = super.attachInternals();
		this[symbols.internals] = internals;
		internals.states.add('--pending');

		this.whenInialized.then(() => {
			internals.states.delete('--pending');
			internals.states.add('--ready');
		});

		return internals;
	}

	get disabled() {
		return getBool(this, 'disabled');
	}

	set disabled(val) {
		setBool(this, 'disabled', val);
	}

	get theme() {
		return getString(this, 'theme', { fallback: 'auto' });
	}

	set theme(val) {
		setString(this, 'theme', val);
	}

	get whenInialized() {
		const { resolve, promise } = Promise.withResolvers();

		if (initialized) {
			resolve();
		} else {
			this.addEventListener('initialized', () => resolve(), { once: true });
		}

		return promise;

	}
	static get initialized() {
		return initialized;
	}

	static async initialize(auth = getDefaultAuth()) {
		if (initialized) {
			throw new DOMException('Firebase auth already set.');
		} else if (typeof auth === 'object' && ! Object.is(auth, null)) {
			const unsubscribe = onAuthStateChanged(auth, () => {
				authReadyDeferred.resolve();
				unsubscribe();
			});

			await authReadyDeferred;
			initialized = true;
			initializedDeferred.resolve(auth);
			const event = new Event('initialized');
			instances.forEach(inst => inst.dispatchEvent(event));
		} else {
			throw new TypeError('Invalid auth given.');
		}
	}

	static async asDialog({ signal } = {}) {
		const { resolve, reject, promise } = Promise.withResolvers();

		if (signal instanceof AbortSignal && signal.aborted) {
			reject(signal.reason);
		} else {
			const form = new this();
			const dialog = document.createElement('dialog');
			const controller = new AbortController();

			form.addEventListener('success', ({ detail, target }) => {
				resolve(detail);
				target.closest('dialog').close();
				controller.abort();
			}, { signal: controller.signal });

			form.addEventListener('abort', ({ target }) => {
				reject(new DOMException('User aborted.'));
				controller.abort();
				target.closest('dialog').close();
			}, { signal: controller.signal });

			dialog.append(form);

			dialog.addEventListener('close', ({ target }) => {
				target.remove();

				if (! controller.signal.aborted) {
					controller.abort(new DOMException('User aborted.'));
				}
			});

			if (signal instanceof AbortSignal) {
				signal.addEventListener('abort',
					({ target }) => {
						reject(target.reason);
						dialog.close();
					},
					{ once: true, signal: controller.signal }
				);
			}

			await form.whenInitialized;
			document.body.append(dialog);
			dialog.showModal();
		}

		return promise;
	}
}

export const getAuth = async () => await initializedDeferred.promise;
export const initialize = (auth = getDefaultAuth()) => HTMLFirebaseAuthElement.initialize(auth);

export function getFriendlyErrorMessage(firebaseError) {
	if (firebaseError instanceof Error && firebaseError.name === 'FirebaseError') {
		switch (firebaseError.code) {
			// Login Errors
			case 'auth/invalid-email':
				return 'Invalid email address. Please provide a valid email.';

			case 'auth/user-not-found':
				return 'User not found. Please check the provided email.';

			case 'auth/wrong-password':
				return 'Incorrect password. Please check your password and try again.';

			case 'auth/email-already-in-use':
				return 'Email address is already in use. Please choose a different email.';

			case 'auth/weak-password':
				return 'Weak password. Passwords must be sufficiently long and not be commonly used passwords.';

			// Password Reset Errors
			case 'auth/expired-action-code':
				return 'Expired verification code.';

			case 'auth/invalid-action-code':
				return 'Invalid verification code.';

			case 'auth/user-disabled':
				return 'User account has been disabled.';

			default:
				return 'An error occurred while processing your request. Please try again later.';
		}
	}

	// Return a generic error message if not a FirebaseError
	return 'An error occurred while processing your request. Please try again later.';
}

export function getError(firebaseError) {
	return new Error(getFriendlyErrorMessage(firebaseError), { cause: firebaseError });
}

export function isUser(user) {
	return typeof user === 'object' && user !== null && typeof user.uid === 'string';
}

export async function isSignedIn() {
	return await getAuth().then(({ currentUser }) => isUser(currentUser));
}

export async function signOut() {
	getAuth().then(auth => logOut(auth));
}

export async function onSignIn(callback, { signal, once = false, thisObj = globalThis } = {}) {
	if (! (signal instanceof AbortSignal && signal.aborted)) {
		const auth = await getAuth();

		const unsubscribe = onAuthStateChanged(auth, user => {
			if (isUser(user)) {
				callback.call(thisObj, new CustomEvent('sign-in', { detail: user }));

				if (once) {
					unsubscribe();
				}
			}
		});

		if (signal instanceof AbortSignal) {
			signal.addEventListener('abort', () => unsubscribe(), { once: true });
		}
	}
}

export async function onSignOut(callback, { signal, once = false, thisObj = globalThis } = {}) {
	if (! (signal instanceof AbortSignal && signal.aborted)) {
		const auth = await getAuth();

		const unsubscribe = onAuthStateChanged(auth, user => {
			if (! isUser(user)) {
				callback.call(thisObj, new Event('sign-out'));

				if (once) {
					unsubscribe();
				}
			}
		});

		if (signal instanceof AbortSignal) {
			signal.addEventListener('abort', () => unsubscribe(), { once: true });
		}
	}
}

export async function whenSignedIn({ signal } = {}) {
	const { promise, resolve, reject } = Promise.withResolvers();

	if (signal instanceof AbortSignal && signal.aborted) {
		reject(signal.reason);
	} else {
		onSignIn(resolve, { once: true, signal });
	}

	return promise;
}

export async function whenSignedOut({ signal } = {}) {
	const { promise, resolve, reject } = Promise.withResolvers();

	if (signal instanceof AbortSignal && signal.aborted) {
		reject(signal.reason);
	} else {
		onSignOut(resolve, { once: true, signal });
	}

	return promise;
}

export function getSignOutSignal() {
	const controller = new AbortController();
	whenSignedOut().then(() => controller.abort(new DOMException('User is Signed-Out.')));
	return controller.signal;
}

export function createSignOutButton() {
	const btn = document.createElement('button');
	btn.type = 'button';
	registerSignOutButton(btn);

	return btn;
}

export function disableOnSignOut(el, { base = document, signal } = {}) {
	if (typeof el === 'string') {
		disableOnSignOut(base.querySelector(el));
	} else if (! (el instanceof HTMLElement)) {
		throw new TypeError('Cannot disable a non-Element.');
	} else if (! ('disabled' in el)) {
		throw new TypeError('Element cannot be disabled.');
	} else {
		el.disabled = true;

		if (! (signal instanceof AbortSignal)) {
			getAuth().then(auth => {
				onAuthStateChanged(auth, user => el.disabled = ! isUser(user));
			});
		} else if (! signal.aborted) {
			getAuth().then(auth => {
				const unsubscribe = onAuthStateChanged(auth, user => el.disabled = ! isUser(user));
				signal.addEventListener('abort', () => unsubscribe(), { once: true });
			});
		}
	}
}

export function disableOnSignIn(el, { base = document, signal } = {}) {
	if (typeof el === 'string') {
		disableOnSignIn(base.querySelector(el));
	} else if (! (el instanceof HTMLElement)) {
		throw new TypeError('Cannot disable a non-Element.');
	} else if (! ('disabled' in el)) {
		throw new TypeError('Element cannot be disabled.');
	} else {
		el.disabled = true;

		if (! (signal instanceof AbortSignal)) {
			getAuth().then(auth => {
				onAuthStateChanged(auth, user => el.disabled = isUser(user));
			});
		} else if (! signal.aborted) {
			getAuth().then(auth => {
				const unsubscribe = onAuthStateChanged(auth, user => el.disabled = isUser(user));
				signal.addEventListener('abort', () => unsubscribe(), { once: true });
			});
		}
	}
}

export function registerSignOutButton(btn, { base = document } = {}) {
	if (typeof btn === 'string') {
		return registerSignOutButton(base.querySelector(btn));
	} else if (! (btn instanceof HTMLButtonElement)) {
		throw  new TypeError('Cannot register a non-<button> as a sign-out button.');
	} else {
		disableOnSignOut(btn);
		getAuth().then(auth => {
			btn.addEventListener('click', () => logOut(auth));
		});
	}
}

export function createReAuthentication() {
	const fieldset = createElement('fieldset', {
		classList:['no-border'],
		disabled: ! initialized,
		part: ['re-auth'],
		children: [
			createElement('div', {
				classList:  ['form-group'],
				children: [
					createElement('label', {
						for: 're-auth-email',
						classList: ['input-label', 'required'],
						children: [
							createSlot('re-auth-email-icon', {
								children: [
									createMailIcon(iconOptions),
								]
							}),
							createSlot('re-auth-email-label', { text: 'Email Address' }),
						]
					}),
					createInput('email', {
						id: 're-auth-email',
						type: 'email',
						classList: ['input'],
						placeholder: 'user@example.com',
						required: true,
					}),
				]
			}),
			createElement('div', {
				classList:  ['form-group'],
				children: [
					createElement('label', {
						for: 're-auth-password',
						classList: ['input-label', 'required'],
						children: [
							createSlot('re-auth-password-icon', {
								children: [
									createDialogPasswordIcon(iconOptions),
								]
							}),
							createSlot('re-auth-password-label', { text: 'Password' }),
						]
					}),
					createInput('password', {
						id: 're-auth-password',
						type: 'password',
						classList: ['input'],
						minlength: 8,
						placeholder: '********',
						required: true,
						events: {
							change: async ({ target }) => {
								if (target.value.length > 7) {
									const { currentUser } = await getAuth();

									if (typeof currentUser === 'object') {
										try {
											const cred = EmailAuthProvider.credential(currentUser.email, target.value);
											await reauthenticateWithCredential(currentUser, cred);

											target.setCustomValidity('');
											fieldset.disabled = true;
										} catch(err) {
											target.setCustomValidity(err.message);
											console.error(err);
										}
									}
								}
							}
						}
					}),
				]
			})
		]
	});

	getAuth().then(auth => {
		fieldset.disabled = false;
		const input  = fieldset.querySelector('re-auth-email');
		input.value = auth.currentUser.email;
		input.readOnly = true;
	});

	return fieldset;
}
