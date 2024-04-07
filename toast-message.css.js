:host {
	display: block;
	position: fixed;
	height: var(--toast-height, auto);
	bottom: calc(-1 * var(--toast-height, 8rem));
	z-index: var(--toast-z-index, 2147483647);
	width: 800px;
	max-width: 100vw;
	max-height: var(--toast-max-height, 95vh);
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
}

.container {
	display: block;
	position: fixed;
	height: var(--toast-height, auto);
	bottom: calc(-1 * var(--toast-height, 8rem));
	background: var(--toast-background, var(--primary-color, #fafafa));
	color: var(--toast-color, var(--default-color, #373737));
	width: 800px;
	max-width: 100vw;
	max-height: var(--toast-max-height, 95vh);
	overflow: auto;
	padding: var(--toast-padding, 0.8rem);
	border: var(--toast-border, none);
	box-shadow: var(--toast-shadow, 0 -4px 6px rgba(0, 0, 0, 0.7));
	border-radius: var(--toast-radius, 4px) var(--toast-radius, 4px) 0 0;
	z-index: var(--toast-z-index, 2147483647);
	scrollbar-color: var(--toast-color, #373737) var(--toast-background, #fafafa);
	scrollbar-width: thin;
}

:host .backdrop {
	background: var(--backdrop-background, rgba(0, 0, 0, 0.7));
	position: fixed;
	z-index: 2147483646;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transition: background 300ms ease-in-out;
}

.backdrop[hidden] {
	background: transparent;
}

@media(min-width: 800px) {
	:host {
		left: calc(50vw - 400px);
	}
}

button {
	cursor: pointer;
}

.icon, .icon * {
	color: inherit;
	max-width: 100%;
	max-height: 100%;
	width: var(--icon-size, 1em);
	height: var(--icon-size, 1em);
	vertical-align: middle;
}

.current-color {
	fill: currentColor;
}

slot[name="close-icon"] {
	color: var(--toast-color, var(--default-color, #373737));
}

.center {
	text-align: center;
}

.block {
	display: block;
}

#close-toast-button {
	border: none;
	background: transparent;
	position: sticky;
	top: 0;
	float: right;
	right: 12px;
	padding: 12px;
	font-size: 2em;
}
