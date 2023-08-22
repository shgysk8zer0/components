import { onAuthStateChanged, getAuth as getDefaultAuth } from 'firebase/firebase-auth.js';
import { getString, setString, getBool, setBool } from '@shgysk8zer0/kazoo/attrs.js';
import { formStyles, btnStyles, hostStyles, fonts, flexStyles, cursorStyles, commonStyles } from '../styles.js';

const initializedDeferred = Promise.withResolvers();
const authReadyDeferred = Promise.withResolvers();
let initialized = false;
const protectedData = new WeakMap();
const instances = new Set();

export const iconOptions = { height: 18, width: 18, fill: 'currentColor', part: ['icon'], classList: ['icon'] };
export const styles = Promise.all([formStyles, btnStyles, hostStyles, fonts, flexStyles, cursorStyles, commonStyles]);

export class HTMLFirebaseAuthElement extends HTMLElement {
	constructor() {
		super();
		instances.add(this);
	}

	attachInternals() {
		const internals = super.attachInternals();
		protectedData.set(this, { internals });
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

			form.addEventListener('reset', ({ target }) => {
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
				return 'Expired password reset code';

			case 'auth/invalid-action-code':
				return 'Invalid password reset code';

			case 'auth/user-disabled':
				return 'User account has been disabled';

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
