import { url } from './consts.js';

export const isModule = ! (document.currentScript instanceof HTMLScriptElement);
export const meta = isModule
	? { url: import.meta.url, resolve: path => import.meta.resolve(path) }
	: { url, resolve: path => new URL(path, url).href };
