import { loadScript } from '@shgysk8zer0/kazoo/loader.js';

let instances = new WeakMap();

export const VERSION = '/v3/';

export const loadStripe = (async () => {
	if ('Stripe' in globalThis) {
		return globalThis.Stripe;
	} else {
		await loadScript(new URL(VERSION, 'https://js.stripe.com/'));

		if ('Stripe' in globalThis) {
			return globalThis.Stripe;
		} else {
			throw new Error('Error loading Stripe');
		}
	}
});

export const getStripeInstance = (async key => {
	if (instances.has(key)) {
		return instances.get(key);
	} else {
		const Stripe = await loadStripe();
		const instance = Stripe(key);
		instances.set(key, instance);
		return instance;
	}
});

export function getCurrencySymbol() {
	return '$';
}
