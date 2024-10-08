/* eslint-env node */
import { getConfig } from '@shgysk8zer0/js-utils/rollup';
import { rollupImport } from '@shgysk8zer0/rollup-import/import';
import { rollupImportMeta } from '@shgysk8zer0/rollup-import/meta';
import { readJSONFile } from '@shgysk8zer0/npm-utils/json';
import { importmap } from '@shgysk8zer0/importmap';

const { name, version } = await readJSONFile('./package.json');
const url = new URL(`./${name}@${version}/`, 'https://unpkg.com').href;

export default getConfig('./mark-down.js', {
	plugins: [
		rollupImport(importmap),
		rollupImportMeta({ baseURL: url }),
	],
	minify: true,
	sourcemap: true,
	format: 'iife',
});
