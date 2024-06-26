export default `:host {
	display: block;
}

#overview {
	color: var(--color);
	background-color: var(--bg);
	margin-bottom: 0.8em;
	padding: 0.3em 0.3em 0.8em 0.8em;
	border-radius: 0 0 8px 8px;
}

form {
	font-size: 16px;
	line-height: 1.15;

	--stripe-bg: #ffffff;
	--stripe-color: #30313d;
	--stripe-border: #e6e6e6;
	--stripe-shadow: 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(0, 0, 0, 0.02);
	--stripe-focus: rgba(0, 0, 0, 0.03) 0px 1px 1px 0px, rgba(0, 0, 0, 0.02) 0px 3px 6px 0px, rgba(5, 115, 225, 0.25) 0px 0px 0px 3px, rgba(0, 0, 0, 0.08) 0px 1px 1px 0px;
	--stripe-invalid: #df1b41;

	--night-bg: #30313d;
	--night-color: #eeeff0;
	--night-border: #424353;
	--night-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5), 0px 1px 6px rgba(0, 0, 0, 0.25);
	--night-focus: rgba(0, 0, 0, 0.5) 0px 2px 4px 0px, rgba(0, 0, 0, 0.25) 0px 1px 6px 0px, rgba(134, 218, 151, 0.25) 0px 0px 0px 3px, rgba(255, 255, 255, 0.12) 0px 1px 1px 0px;
	--night-invalid: #fe87a1;

	--bg: var(--stripe-bg);
	--color: var(--stripe-color);
	--border: var(--stripe-border);

	color: var(--color);
	background-color: #fefefe;
}

:host([theme="stripe"]) form {
	--bg: var(--stripe-bg);
	--color: var(--stripe-color);
	--border: var(--stripe-border);
	--shadow: var(--stripe-shadow);
	--focus: var(--stripe-focus);
	--invalid: var(--stripe-invalid);
	background-color: #fefefe;
}

:host([theme="night"]) form {
	--bg: var(--night-bg);
	--color: var(--night-color);
	--border: var(--night-border);
	--shadow: var(--night-shadow);
	--focus: var(--night-focus);
	--invalid: var(--night-invalid);
	background-color: #212121;
}

* {
	box-sizing: border-box;
}

.input, .input-label {
	display: block;
}

.input {
	background-color: var(--bg);
	color: var(--color);
}

::slotted([slot="displayitems"]), ::slotted([slot="additionaldisplayitems"]) {
	display: flex;
	flex-direction: row;
	gap: 10px;
	color: var(--color);
}

fieldset:disabled {
	display: none;
}

.cursor-pointer {
	cursor: pointer;
}

.icon {
	max-width: 1em;
	max-height: 1em;
	vertical-align: middle;
}

.flex {
	display: flex;
}

.flex.row {
	flex-direction: row;
}

.space-around {
	justify-content: space-around;
}

.no-border {
	border: none;
}

.btn:not([hidden]) {
	display: inline-block;
	padding: var(--button-padding, 0.3em);
	font-family: var(--button-font, inherit);
	border-radius: var(--button-border-radius, initial);
	box-sizing: border-box;
	cursor: pointer;
}

.btn:disabled, .btn.disabled {
	box-shadow: 0 0 0.3rem var(--shadow-color, rgba(0,0,0,0.4)) inset;
	border: var(--button-disabled-border, var(--button-border, 0.2rem inset black));
}

.btn.btn-primary {
	background-color: var(--button-primary-background);
	border: var(--button-primary-border);
	color: var(--button-primary-color);
}

.btn.btn-primary:hover {
	background-color: var(--button-primary-hover-background, var(--button-primary-active-background, var(--button-primary-background)));
	border: var(--button-primary-hover-border, var(--button-primary-active-border, var(--button-primary-border))));
	color: var(--button-primary-hover-color, var(--button-primary-active-color, var(--button-primary-color))));
}

.btn.btn-primary:active, .btn.btn-primary.active {
	background-color: var(--button-primary-active-background, var(--button-primary-background));
	border: var(--button-primary-active-border, var(--button-primary-border));
	color: var(--button-primary-active-color);
}

.btn.btn-accept {
	background-color: var(--button-accept-background, var(--button-primary-background));
	border: var(--button-accept-active-border, var(--button-primary-border));
	color: var(--button-accept-color, var(--button-primary-color));
}

.btn.btn-accept:hover {
	background-color: var(--button-accept-hover-background, var(--button-accept-active-background, var(--button-primary-hover-background, var(--button-primary-active-background))));
	color: var(--button-accept-hover-color, var(--button-accept-active-color, var(--button-primary-hover-color, var(--button-primary-active-color, var(--button-primary-color)))));
	border: var(--button-accept-hover-border, var(--button-accept-active-border, var(--button-primary-hover-border, var(--button-primary-active-border, var(--button-primary-border)))));
}

.btn.btn-accept:disabled, .btn.btn-accept.disabled {
	background-color: var(--button-accept-disabled-background, var(--button-accept-background, var(--button-disabled-background, var(--button-background,))));
	border: var(--button-accept-disabled-border, var(--button-accept-border, var(--button-disabled-border)));
	color: var(--button-accept-disabled-color, var(--button--accept-color, var(--button-disabled-color)));
}

.btn.btn-accept:active, .btn.btn-accept.active {
	background-color: var(--button-accept-active-background, var(--button-accept-background));
	border: var(--button-accept-active-border, var(--button-accept-border, var(--button-primary-active-border)));
	color: var(--button-accept-active-color, var(--button--accept-color, var(--button-active-color)));
}

.status-box:not(:empty) {
	padding: 1.2em;
	border: 1px dashed currentColor;
	text-align: center;
	margin-top: 0.7em;
	border-radius: 8px;
}

.status-box.alert, .status-box.error {
	color: var(--alert-color, #6f0606);
	background-color: var(--alert-background, #e88a8a);
}

.status-box.warn {
	color: var(--warn-color, #51430c);
	background-color: var(--warn-background, #f0d155);
}

.status-box.info {
	color: var(--info-color, #555553);
	background-color: var(--info-background, #d2d2d2);
}

.status-box.success {
	color: var(--success-color, #1d4f01);
	background-color: var(--success-background, #8cee69);
}

.form-group {
	padding: 4px;
	margin-bottom: 0.4em;
}

.form-group .input-label {
	display: block;
	margin: 0.4em 0;
}

.form-group .input,
.form-group .input:required:invalid:placeholder-shown:not(:focus) {
	display: block;
	width: var(--input-width, 100%);
	max-width: 100%;
	color: var(--color);
	outline: 0;
	border-style: solid;
	border-color: var(--border, #cacaca);
	border-width: 1px;
	border-radius: 4px;
	background-color: var(--bg);
	box-shadow: var(--shadow);
	padding: 0.85em;
	transition: color 300ms ease-in-out;
}

.form-group .input:focus {
	box-shadow: var(--focus);
}

.form-group .input:invalid:not(:focus) {
	box-shadow: none;
}

.form-group .input:invalid:not(:focus) {
	color: var(--invalid, #871717);
	border-color: var(--invalid, #871717);
}

details.accordion {
	position: relative;
	z-index: 0;
	overflow: hidden;
}

details.accordion > summary {
	background-color: var(--accordion-theme-color, var(--button-primary-background));
	color: var(--accordion-header-color, var(--button-primary-color));
	padding: 0.8em;
	position: relative;
	z-index: 1;
	font-weight: 800;
}

details.accordion.no-marker > summary {
	list-style: none;
}

details.accordion.no-marker > summary::marker {
	display: none;
}

details.accordion > * {
	border-bottom: 1px solid var(--accordion-border-color, #6a6a6a);
}

details.accordion > :not(summary) {
	background-color: var(--bg);
	color: var(--color);
	padding: 0.6em 1.7em;
	border-left: 8px solid transparent;
	transform-origin: top;
	transition: border-color 400ms ease-in-out;
}

details.accordion > :not(summary):hover {
	border-color: var(--accordion-theme-color, var(--button-primary-active-background));
}`;
