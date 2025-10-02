import dedent from './node_modules/string-dedent/dist/dedent.mjs';
import '@shgysk8zer0/polyfills/array.js';
import '@shgysk8zer0/polyfills/object.js';
import '@shgysk8zer0/polyfills/url.js';
import '@shgysk8zer0/polyfills/iterator.js';
import '@shgysk8zer0/polyfills/map.js';
import '@shgysk8zer0/polyfills/promise.js';
import '@shgysk8zer0/polyfills/CSSStyleSheet.js';
import '@aegisjsproject/core/bundle.js';
import '@shgysk8zer0/polyfills/elementInternals.js';
import '@shgysk8zer0/polyfills/element.js';
import '@shgysk8zer0/polyfills/request.js';
import '@shgysk8zer0/polyfills/response.js';
import '@shgysk8zer0/polyfills/blob.js';
import '@shgysk8zer0/polyfills/command.js';

if (! (String.dedent instanceof Function)) {
	String.dedent = dedent;
}
