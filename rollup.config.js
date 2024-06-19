/* eslint-env node */
import { warningHandler as onwarn } from '@shgysk8zer0/js-utils/rollup';
import { rollupImport } from '@shgysk8zer0/rollup-import/import';
import terser from '@rollup/plugin-terser';
import { rollupImportMeta } from '@shgysk8zer0/rollup-import/meta';
import { importmap } from './importmap.js';
import { readJSONFile } from '@shgysk8zer0/npm-utils/json';

const { name, version } = await readJSONFile('./package.json');
const url = new URL(`./${name}@${version}/`, 'https://unpkg.com').href;

const plugins = [
	rollupImport(importmap),
	rollupImportMeta({ baseURL: url }),
	terser(),
];

const globals = {};
const external = [];
const config = { format: 'iife', sourcemap: true, globals };
// npm run build:js:maps && npm run build:js:share && npm run build:js:mark-down

export default [{
	input: './polyfills.js',
	onwarn, plugins, external,
	output: { file: './polyfills.min.js', ...config },
}, {
	input: './leaflet/bundle.js',
	onwarn, plugins, external,
	output: { file: './leaflet/bundle.min.js', ...config },
}, {
	input: './button/share.js',
	onwarn, plugins, external,
	output: { file: './button/share.min.js', ...config },
}, {
	input: './mark-down.js',
	onwarn, plugins, external,
	output: { file: './mark-down.min.js', ...config },
}];
