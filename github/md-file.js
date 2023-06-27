import { HTMLMarkDownElement } from '../mark-down.js';
import { getString, setString } from '@shgysk8zer0/kazoo/attrs.js';

export class HTMLGitHubMDFileElement extends HTMLMarkDownElement {
	#timeout = NaN;
	static observedAttributes = [...HTMLMarkDownElement.observedAttributes, 'user', 'repo', 'branch', 'file'];

	attributeChangedCallback(name, oldVal, newVal) {
		if (name === 'src') {
			super.attributeChangedCallback(name, oldVal, newVal);
		} else if (typeof newVal === 'string') {
			if (! Number.isNaN(this.#timeout)) {
				clearTimeout(this.#timeout);
			}

			this.#timeout = setTimeout(() => {
				const { user, repo, branch, file } = this;

				if (typeof user === 'string' && typeof repo === 'string' && typeof file === 'string') {
					const url = new URL(file, `https://raw.githubusercontent.com/${user}/${repo}/${branch}/`);
					this.src = url.href;
				}

				this.#timeout = NaN;
			});
		}
	}

	get user() {
		return getString(this, 'user');
	}

	set user(val) {
		setString(this, 'user', val);
	}

	get repo() {
		return getString(this, 'repo');
	}

	set repo(val) {
		setString(this, 'repo', val);
	}

	get file() {
		return getString(this, 'file');
	}

	set file(val) {
		setString(this, 'file', val);
	}

	get branch() {
		return getString(this, 'branch', { fallback: 'main' });
	}

	set branch(val) {
		setString(this, 'branch', val);
	}
}

customElements.define('github-md-file', HTMLGitHubMDFileElement);
