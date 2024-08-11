import { createSelect, createOption } from '@shgysk8zer0/kazoo/elements.js';

customElements.define('timezone-select', class HTMLTimezoneSelectElement extends HTMLElement {
	#shadow;
	#internals;
	#form;
	#select;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#internals = this.attachInternals();

		this.#internals.role = 'combobox';
		this.#select = this.#buildSelect();

		Promise.all([
			new CSSStyleSheet().replace(`:host {
				display: inline-block;
				appearance: listbox;
			}

			.select {
				appearance: none;
				border: none;
				background: transparent;
				width: 100%;
				font: inherit;
			}`)
		]).then(sheets => this.#shadow.adoptedStyleSheets = sheets);

		this.#shadow.append(this.#select);
		this.#update();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'disabled':
				this.#select.disabled = typeof newVal === 'string';
				this.#internals.ariaDisabled = typeof newVal === 'string' ? 'true' : 'false';
				break;

			case 'required':
				this.#select.required = typeof newVal === 'string';
				this.#internals.ariaRequired = typeof newVal === 'string' ? 'true' : 'false';
				this.#internals.setValidity(this.#select.validity);
				break;

			case 'readonly':
				this.#select.readOnly = typeof newVal === 'string';
				break;

			default:
				throw new DOMException(`Unhandled attribute changed: ${name}.`);

		}
	}

	formAssociatedCallback(form) {
		this.#form = form;
	}

	formDisabledCallback(disabled) {
		this.#select.disabled = disabled;
	}

	formResetCallback() {
		this.#select.value = '';
	}

	formStateRestoreCallback(state) {
		this.#select.value = state;
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(val) {
		this.toggleAttribute('disabled', val);
	}

	get form() {
		return this.#form;
	}

	get options() {
		return this.#select.options;
	}

	get name() {
		return this.getAttribute('name');
	}

	set name(val) {
		if (typeof val === 'string') {
			this.setAttribute('name', val);
		} else {
			this.removeAttribute('name');
		}
	}

	get readOnly() {
		return this.hasAttribute('readonly');
	}

	set readOnly(val) {
		this.toggleAttribute('readonly', val);
	}

	get required() {
		return this.hasAttribute('required');
	}

	set required(val) {
		this.toggleAttribute('required', val);
	}

	get selectedIndex() {
		return this.#select.selectedIndex;
	}

	set selectedIndex(val) {
		this.#select.selectedIndex = val;
		this.#update();
	}

	get selectedOptions() {
		return this.#select.selectedOptions;
	}

	get type() {
		return 'select-multiple';
	}

	get validity() {
		return this.#select.validity;
	}

	get value() {
		return this.#select.value;
	}

	set value(val) {
		this.#select.value = val;
		this.#update();
	}

	get willValidate() {
		return this.#select.willValidate;
	}

	checkValidity() {
		return this.#select.checkValidity();
	}

	item(n) {
		return this.#select.item(n);
	}

	namedItem(name) {
		return this.#select.namedItem(name);
	}

	reportValidity() {
		return this.#select.reportValidity();
	}

	showPicker() {
		this.#select.showPicker();
	}

	#buildSelect() {
		const timezones = Object.groupBy(HTMLTimezoneSelectElement.timezones, tz => tz.includes('/') ? tz.substring(0, tz.indexOf('/')) : 'Other');
		const select = createSelect('timezone', Object.entries(timezones).map(([label, options]) => ({ label, options })));

		select.prepend(createOption({ label: 'Select timezone', value: '', selected: true }));
		select.classList.add('select');
		select.part.add('select');

		select.addEventListener('change', () => this.#update.bind(this), { passive: true });

		select.value = new Intl.DateTimeFormat().resolvedOptions().timeZone;
		return select;
	}

	#update() {
		this.#internals.setFormValue(this.#select.value);
		this.#internals.setValidity(this.#select.validity);
		this.#internals.ariaValueNow = this.#select.value;
		this.dispatchEvent(new Event('change'));
	}

	static get formAssociated() {
		return true;
	}

	static get observedAttributes() {
		return ['disabled', 'required', 'readonly'];
	}

	static get timezones() {
		return Intl.supportedValuesOf('timeZone');
	}
});
