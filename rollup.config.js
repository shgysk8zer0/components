/* eslint-env node */
import terser from '@rollup/plugin-terser';
import { rollupImport } from '@shgysk8zer0/rollup-import';

export default {
	input: 'test/js/index.js',
	output: {
		file: 'test/js/index.min.js',
		format: 'iife',
		sourcemap: true,
	},
	plugins: [
		rollupImport(['./importmap.json']),
		terser(),
	],
};
