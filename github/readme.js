import { HTMLGitHubMDFileElement } from './md-file.js';

class HTMLGitHubReadmeElement extends HTMLGitHubMDFileElement {
	file = 'README.md';
}

customElements.define('github-readme', HTMLGitHubReadmeElement);
