/* eslint-env node */
import terser from '@rollup/plugin-terser';
import { rollupImport } from '@shgysk8zer0/rollup-import';

export default {
	input: 'leaflet/bundle.js',
	output: {
		file: 'leaflet/map.min.js',
		format: 'iife',
		sourcemap: true,
	},
	plugins: [
		rollupImport('importmap.json'),
		terser(),
	],
};
