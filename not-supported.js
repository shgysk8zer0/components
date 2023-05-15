import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';

registerCustomElement('not-supported', class HTMLNotSupportedElement extends HTMLElement
{
	/**
	 * If custom elements are supported, as evidenced by this method being called,
	 * simply remove the element.
	 */
	connectedCallback() {
		this.remove();
	}
});
