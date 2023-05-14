/* eslint-env node */

import terser from '@rollup/plugin-terser';
import { rollupImport } from '@shgysk8zer0/rollup-import';

export default {
	input: 'krv/events.js',
	output: {
		file: 'krv/events.min.js',
		format: 'iife',
		sourcemap: true,
	},
	plugins: [
		rollupImport('importmap.json'),
		terser(),
	],
};
