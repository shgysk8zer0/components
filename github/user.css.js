export default `:host {
	display: inline-block;
	font-family: 'Roboto', sans-serif;
	text-align: left;
	padding: 0.7em 0.8em;
	margin: 0.5em;
	border: 1px solid #cecece;
	border-radius: 8px;
	overflow: auto;
	line-height: 1.4;
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
}

:host(:not([bio])) [part~="bio"] {
	display: none;
}

[part~="avatar"] {
	border-radius: 6px;
	vertical-align: top;
	margin: 0.6em;
}

[part~="icon"] {
	fill: currentColor;
	height: 1em;
	width: 1em;
	vertical-align: middle;
}

[part~="name"] {
	font-size: 1.6em;
}

[part~="bio"] {
	overflow: auto;
	padding-left: 1.4em;
	margin: 0.4em;
	border-left: 7px solid currentColor;
}

.clearfix::after {
	display: block;
	content: '';
	clear: both;
}

.float-left {
	float: left;
}

.inline-block {
	display: inline-block;
}

.color-inherit {
	color: inherit;
}`;
