import { createElement } from '@shgysk8er0/kazoo/elements.js';

const symbols = {
	internals: Symbol('internals'),
	shadow: Symbol('shadow'),
	controller: Symbol('controller'),
	wasChecked: Symbol('was-checked'),
	formIsDisabled: Symbol('form-is-disabled'),
};
	
customElements.define('input-toggle', class HTMLInputToggleElement extends HTMLElement {	
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });
		const internals = this.attachInternals();
		
		Object.definedProperties(this, {
			[symbols.internals]: {
				value: internals,
				enumerable: false,
				configurable: false,
				writable: false,
			},
			[symbols.shadow]: {
				value: shadow,
				enumerable: false,
				configurable: false,
				writable: false,
			},
			[symbols.controller]: {
				value: null,
				enumerable: false,
				configurable: false,
				writable: true,
			},
			[symbols.wasChecked]: {
				value: false,
				enumerable: false,
				configurable: false,
				writable: true,
			},
			
			[symbols.formIsDisabled]: {
				value: false,
				enumerable: false,
				configurable: false,
				writable: true,
			},
		});
		this.addEventListener('click', () => {
			if (! (this[symbols.internals].states.has('--disabled') || this[symbols.internals].states.has('--readonly'))) {
				this.checked = ! this.checked;					
			}
		});
		
		this[symbols.shadow].append(
			createElement('div', {
				part: ['track'],
				classList: ['track'],
				children:[
					createElement('div', {
						part: ['slider'],
						classList: ['slider'],
					})
				]
			}));
		
		Promise.all([
			new CSSStyleSheet().replace(`
				:host {
					dispay: inline-block;
				}
				
				.track {
					display: inline-block;
					box-sizing: border-box;
					width: 80px;
					height: 28px;
					padding: 4px;
					background-color: #1c71d8;
					border-radius: 10px;
				}
				
				.slider {
					display: inline-block;
					box-sizing:	border-box;
					width: 20px;
					height: 20px;
					border-radius: 100%;
					background-color: #f6f5f4;
					transform: none;
					transition: transform 600ms ease-in-out;
				}
				
				:host(._state--readonly) {
					pointer-events: none;
					filter: saturate(0.5);
				}
				
				:host(:--readonly) {
					pointer-events: none;
					filter: saturate(0.5);
				}
				
				:host(._state--disabled) {
					pointer-events: none;
					filter: saturate(0.1);
				}
				
				:host(:--disabled) {
					pointer-events: none;
					filter: saturate(0.1);
				}
				
				:host([checked]) .slider {
					transform: translateX(54px);
				}
			`)
		]).then(sheets => this[symbols.shadow].adoptedStyleSheets = sheets);
	}
	
	connectedCallback() {
		this[symbols.internals].role = 'checkbox';
		this[symbols.internals].ariaChecked = this.checked ? 'true' : 'false';
		this[symbols.wasChecked] = this.checked;
	}
	
	attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'checked':
				console.log({ name, oldVal, newVal });
				if (typeof newVal === 'string') {
					this[symbols.internals].setFormValue(this.value);
					this[symbols.internals].ariaCheck = 'true';
					this[symbols.internals].states.add('--checked');
					
					if (this.required) {
						const validity = this[symbols.internals].validity;
						console.log(validity);
						this[symbols.internals].setValidity({ valueMissing: false });
					}
				} else {
					this[symbols.internals].setFormValue(null);
					this[symbols.internals].ariaCheck = 'false';
					this[symbols.internals].states.delete('--checked');
					
					if (this.required) {
						this[symbols.internals].setValidity({ valueMissing: true }, 'This is a required field and must be checked');						
					}
				}
				
				if (typeof oldVal !== typeof newVal) {
					this.dispatchEvent(new Event('change'));
				}
				break;
				
			case 'disabled':
				if (typeof newVal === 'string') {
					this[symbols.internals].ariaDisabled = 'true';
					this[symbols.internals].states.add('--disabled');
				} else {
					this[symbols.internals].ariaDisabled = 'false';
					this[symbols.internals].states.delete('--disabled');
				}
				break;
				
			case 'readonly':
				if (typeof newVal === 'string') {
					this[symbols.internals].ariaReadOnly = 'true';
					this[symbols.internals].states.add('--readonly');
				} else {
					this[symbols.internals].ariaReadOnly = 'false';
					this[symbols.internals].states.delete('--readonly');
				}
				break;
				
			case 'required':
				if (typeof newVal === 'string') {
					this[symbols.internals].ariaRequired = 'true';
					this[symbols.internals].states.add('--required');
				} else {
					this[symbols.internals].ariaRequired = 'false';
					this[symbols.internals].states.delete('--required');
				}
				break;
				
			case 'value':
				if (this.checked) {
					this[symbols.internals].setFormValue(this.value);
				}
				break;
		}
	}
	
	formAssociatedCallback() {
		if (this[symbols.controller] instanceof AbortController) {
			this[symbols.controller].abort();
		}
		this[symbols.controller] = new AbortController();
	}
	
	formDisabledCallback(disabled) {
		this[symbols.formIsDisabled] = false;
		
		if (disabled) {
			this[symbols.internals].states.add('--disabled');
		} else if (! this.disabled) {
			this[symbols.internals].states.delete('--disabled');
		}
	}
	
	formResetCallback() {
		this.checked = this[symbols.wasChecked];
	}
	
	checkValidity() {
		return this[symbols.internals].checkValidity();
	}
	
	reportValidity() {
		return this[symbols.internals].reportValidity();
	}
	
	get checked() {
		return this.hasAttribute('checked');
	}
	
	set checked(val) {
		this.toggleAttribute('checked', val);
	}
	
	get disabled() {
		return this.hasAttribute('disabled');
	}
	
	set disabled(val) {
		this.toggleAttribute('disabled', val);
	}
	
	get form() {
		return this[symbols.internals].form;
	}
	
	get labels() {
		return this[symbols.internals].labels;
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
	
	get validationMessage() {
		return this[symbols.internals].validationMessage;
	}
	
	get validity() {
		return this[symbols.internals].validity;
	}
	
	get value() {
		if (this.hasAttribute('value')) {
			return this.getAttribute('value');
		} else {
			return 'on';
		}
	}
	
	set value(val) {
		if (typeof val === 'string') {
			this.setAttribute('value', val);
		} else {
			this.removeAttribute('value');
		}
	}
	
	get willValidate() {
		return this[symbols.internals].willValidate;
	}
	
	static get formAssociated() {
		return true;
	}

	static get observedAttributes() {
		return ['checked', 'disabled', 'required', 'readonly', 'value'];
	}
});
