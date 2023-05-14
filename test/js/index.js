// import '@shgysk8zer0/kazoo/harden.js';
import '@shgysk8zer0/polyfills';
import '@shgysk8zer0/kazoo/harden.js';
import { konami } from '@shgysk8zer0/konami';
import { name, version } from '../../consts.js';

trustedTypes.createPolicy('default', {
	createHTML: input => new Sanitizer().sanitizeFor('diiv', input).innerHTML,
});

document.title = `${name} v${version}`;

konami().then(() => alert('Hello, World!'));
