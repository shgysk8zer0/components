export default `:host, :host([role="button"]) {
	display: inline-block;
	max-width: 100%;
	max-height: 100%;
	vertical-align: middle;
	padding: 0;
	background: none;
	border: none;
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
}

:host([disabled]) {
	pointer-events: none;
}

:host([disabled][target]) [part~="container"] {
	background-color: #585858;
}

button:focus, [role="button"]:focus, .btn:focus, summary:focus, input:focus,
select:focus, textarea:focus, .input:focus, [tabindex]:focus, a:focus, [tabindex]:focus {
	outline-width: var(--focus-outline-width, thin);
	outline-style: var(--focus-outline-style, dotted);
	outline-color: var(--focus-outline-color, currentColor);
	outline-offset: var(--focus-outline-offset, 3px);
}

[part="container"] {
	--height: 64px;
	--width: 180px;
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-evenly;
	background-color: #343434;
	color: #fefefe;
	font-family: Roboto, Arial, Helvetica, sans-serif;
	font-size: 18px;
	vertical-align: middle;
	box-sizing: border-box;
	min-width: var(--width, 180px);
	max-width: 100%;
	min-height: var(--height, 64px);
	padding: 6px 23px 6px 16px;
	border-radius: 2px;
	cursor: pointer;
}

[part="text"] {
	font-size: 22px;
}

:host([stack]) [part="container"] {
	display: block;
	text-align: center;
}

:host([stack]) [part="text"] {
	display: block;
}

:host([target="facebook"]) [part="container"] {
	background-color: #3c5a99;
}

:host([target="twitter"]) [part="container"] {
	background-color: #6babe1;
}

:host([target="reddit"]) [part="container"] {
	background-color: #ff4500;
}

:host([target="linkedin"]) [part="container"] {
	background-color: #1d87bd;
}

:host([target="pinterest"]) [part="container"] {
	background-color: #CB1F27;
}

:host([target="tumblr"]) [part="container"] {
	background-color: #39475d;
}

:host([target="telegram"]) [part="container"] {
	background-color: #37aee2;
}

:host([target="email"]) [part="container"] {
	background-color: #343434;
}

:host(:not([target="facebook"]))  [part~="facebook-icon"] {
	display: none;
}

:host(:not([target="twitter"]))  [part~="twitter-icon"] {
	display: none;
}

:host(:not([target="reddit"]))  [part~="reddit-icon"] {
	display: none;
}

:host(:not([target="linkedin"]))  [part~="linkedin-icon"] {
	display: none;
}

:host(:not([target="gmail"])) [part~="gmail-icon"] {
	display: none;
}

:host(:not([target="email"]))  [part~="email-icon"] {
	display: none;
}

:host(:not([target="clipboard"])) [part~="clipboard-icon"] {
	display: none;
}

:host(:not([target="print"])) [part~="print-icon"] {
	display: none;
}

:host(:not([target="pinterest"])) [part~="pinterest-icon"] {
	display: none;
}

:host(:not([target="tumblr"])) [part~="tumblr-icon"] {
	display: none;
}

:host(:not([target="telegram"])) [part~="telegram-icon"] {
	display: none;
}

.inline-block {
	display: inline-block;
}

.current-color {
	fill: currentColor;
}

@media(max-width: 800px) {
	.mobile-hidden {
		display: none;
	}
}

#network {
	text-transform: capitalize;
}`;
