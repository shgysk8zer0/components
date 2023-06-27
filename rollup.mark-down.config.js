/* eslint-env node */
import { getConfig } from '@shgysk8zer0/js-utils/rollup';
import { rollupImport } from '@shgysk8zer0/rollup-import/import';
import { rollupImportMeta } from '@shgysk8zer0/rollup-import/meta';
import { readJSONFile } from '@shgysk8zer0/npm-utils/json';

const importmap = {
	imports: {
		'@shgysk8zer0/kazoo/': 'https://unpkg.com/@shgysk8zer0/kazoo@0.0.16/',
		marked: 'https://unpkg.com/marked@5.1.0/src/marked.js',
		'marked-highlight': 'https://unpkg.com/marked-highlight@2.0.1/src/index.js',
		'highlight.js': 'https://unpkg.com/@highlightjs/cdn-assets@11.8.0/es/highlight.min.js'
	}
};

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
