import { html } from '@aegisjsproject/parsers/html.js';
import { css } from '@aegisjsproject/parsers/css.js';

const STATES = {
	pending: 'pending',
	success: 'success',
	failed: 'failed',
	idle: 'idle',
};

const template = html`<div part="container" id="container" aria-hidden="true">
	<div id="pending" part="state loading">
		<slot name="pending">
			<svg part="status-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
				<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-linecap="round">
					<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
				</circle>
			</svg>
		</slot>
	</div>
	<div id="success" part="state success">
		<slot name="success">
			<svg part="status-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="16" fill="currentColor" viewBox="0 0 12 16">
				<path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"/>
			</svg>
		</slot>
	</div>
	<div id="failed" part="state failed">
		<slot name="failed">
			<svg part="status-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="16" fill="currentColor" viewBox="0 0 12 16">
				<path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/>
			</svg>
		</slot>
	</div>
</div>`;

const style = css`:host {
	display: inline-block;
}

:host(:not(:state(${STATES.pending}))) #pending {
	display: none;
}

:host(:not(:state(${STATES.success}))) #success {
	display: none;
}

:host(:not(:state(${STATES.failed}))) #failed {
	display: none;
}

:host(:state(${STATES.idle})) #container {
	visibility: hidden;
}

[part="status-icon"] {
	height: 1em;
	width: auto;
}`;

export class HTMLStatusIndicatorElement extends HTMLElement {
	#shadow = this.attachShadow({ mode: 'closed' });
	#internals = this.attachInternals();
	#resolvers = Promise.withResolvers();

	constructor() {
		super();
		this.#shadow.append(template.cloneNode(true));
		this.#shadow.adoptedStyleSheets = [style];
		this.#internals.states.add(STATES.pending);
		this.#internals.ariaLabel = 'Pending';
		this.#internals.role = 'status';
		this.#internals.ariaBusy = true;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch(name) {
			case 'idle':
				if (typeof newValue === 'string') {
					this.#internals.states.add(STATES.idle);
					this.#internals.ariaHidden = 'true';
				} else {
					this.#internals.states.delete(STATES.idle);
					this.#internals.ariaHidden = 'false';
				}
				break;
		}
	}

	get idle() {
		return this.hasAttribute('idle');
	}

	set idle(val) {
		this.toggleAttribute('idle', val);
	}

	get pending() {
		return this.#internals.states.has(STATES.pending);
	}

	get state() {
		const states = this.#internals.states;

		if (states.has(STATES.pending)) {
			return STATES.pending;
		} else if (states.has(STATES.success)) {
			return STATES.success;
		} else if (states.has(STATES.failed)) {
			return STATES.failed;
		} else {
			return null;
		}
	}

	resolve(result = null) {
		if (this.pending) {
			this.#resolvers.resolve(result);
			this.#internals.states.delete(STATES.pending);
			this.#internals.states.add(STATES.success);
			this.#internals.ariaLabel = 'Success';
			this.#internals.ariaBusy = false;

			return true;
		} else {
			return false;
		}
	}

	reject(reason = new DOMException('The operation was aborted.')) {
		if (this.pending) {
			this.#resolvers.reject(reason);
			this.#internals.states.delete(STATES.pending);
			this.#internals.states.add(STATES.failed);
			this.#internals.ariaLabel = 'Failed';
			this.#internals.ariaBusy = false;

			return true;
		} else {
			return false;
		}
	}

	reset({
		idle = false,
		reason = new DOMException('The status was reset.'),
	} = {}) {
		if (this.pending) {
			this.idle = idle;

			return this;
		} else {
			this.#resolvers.reject(reason);
			this.#resolvers = Promise.withResolvers();
			this.idle = idle;
			this.#internals.states.clear();
			this.#internals.states.add(STATES.pending);
			this.#internals.ariaLabel = 'Pending';
			this.#internals.ariaBusy = true;

			return this;
		}
	}

	async then(onFulfilled, onRejected) {
		return await this.#resolvers.promise.then(onFulfilled, onRejected);
	}

	async catch(onRejected) {
		return await this.#resolvers.promise.catch(onRejected);
	}

	async finally(callback) {
		return await this.#resolvers.promise.finally(callback);
	}

	static get observedAttributes() {
		return ['idle'];
	}

	static create(idle = true) {
		const status = new this();

		if (idle) {
			status.idle = true;
		}

		return status;
	}
}

customElements.define('status-indicator', HTMLStatusIndicatorElement);
