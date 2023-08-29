import { getBool, setBool, getString, setString, getInt, setInt } from '@shgysk8zer0/kazoo/attrs.js';

const protectedData = new WeakMap();

const symbols = {
	internals: Symbol('internals'),
	shadow: Symbol('shadow'),
};

export const STATES = {
	checked: '--checked',
	required: '--required',
	disabled: '--disabled',
	invalid: '--invalid',
	valid: '--valid',
	loading: '--loading',
	readOnly: '--readonly',
};

export class HTMLCustomInputElement extends HTMLElement {
	constructor() {
		super();
		Object.defineProperties(this, {
			[symbols.internals]: {
				value: null,
				enumerable: false,
				configurable: false,
				writable: true,
			},
			[symbols.shadow]: {
				value: null,
				enumerable: false,
				configurable: false,
				writable: true,
			},
		});
	}

	attachInternals() {
		const internals = super.attachInternals;
		protectedData.set(this, internals);
		return internals;
	}

	// call `super.attributeChangedCallback(name, oldVal, newVal)`
	attributeChangedCallback(name, oldVal, newVal) {
		const internals = this[symbols.internals];

		switch(name) {
			case 'required':
				if (typeof newVal === 'string') {
					internals.states.add(STATES.required);
					internals.ariaRequired = 'true';
				} else {
					internals.states.delete(STATES.required);
					internals.ariaRequired = 'false';
				}
				break;

			case 'readonly':
				if (typeof newVal === 'string') {
					internals.ariaReadOnly = 'true';
					internals.states.add(STATES.readOnly);
				} else {
					internals.ariaReadOnly = 'false';
					internals.states.delete(STATES.readOnly);
				}
		}
	}

	// Call `super.connectedCallback()` when overriding
	connectedCallback() {
		if (! protectedData.has(this)) {
			this.attachInternals();
		}

		const internals = this[symbols.internals];

		if (! (typeof internals.role === 'string' || typeof this.role === 'string')) {
			this.role = 'input';
		}

		if (! this.hasAttribute('tabindex')) {
			this.tabIndex = 0;
		}

		if (internals._associateForm instanceof Function) {
			internals._associateForm(this.closest('form'), this);
		}
	}

	// Call `super.disconnectedCallback()` when overriding
	disconnectedCallback() {
		const internals = this[symbols.internals];

		if (internals._associateForm instanceof Function) {
			internals._associateForm(null, this);
		}
	}

	// formResetCallback()
	// formAssociatedCallback(form)
	// formStateRestoreCallback(state, mode ["restore" | "autocomplete"])

	// Call `super.formDisabledCallback(disabled)` when overriding
	formDisabledCallback(disabled) {
		if (disabled) {
			this[symbols.internals].states.add(STATES.disabled);
		} else {
			this[symbols.internals].states.delete(STATES.disabled);
		}
	}

	get disabled() {
		return getBool(this, 'disabled');
	}

	set disabled(val) {
		setBool(this, 'disabled', val);
	}

	get form() {
		return this[symbols.internals].form;
	}

	get labels() {
		return this[symbols.internals].labels;
	}

	get maxLength() {
		return getInt(this, 'maxlength', { min: 0 });
	}

	set maxLength(val) {
		setInt(this, 'maxLength', val, { min: 0 });
	}

	get minLength() {
		return getInt(this, 'minlength', { min: 0 });
	}

	set minLength(val) {
		setInt(this, 'minLength', val, { min: 0 });
	}

	get name() {
		return getString(this, 'name');
	}

	set name(val) {
		setString(this, 'name');
	}

	get required() {
		return getBool(this, 'required');
	}

	set required(val) {
		setBool(this, 'required');
	}

	get validationMessage() {
		return this[symbols.internals].validationMessage;
	}

	get validity() {
		return this[symbols.internals].validity;
	}

	get willValidate() {
		return this[symbols.internals].willValidate;
	}

	// `[...HTMLCustomInputElement.observedAttributes, ...]`
	static get observedAttributes() {
		return ['required', 'readonly'];
	}

	static get formAssociated() {
		return true;
	}

	static get STATES() {
		return STATES;
	}
}
