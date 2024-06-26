export default `:host(:not([hidden])) {
	contain: strict;
	display: block;
	position: fixed;
	box-sizing: border-box;
	top: var(--titlebar-area-y, 0);
	top: env(titlebar-area-y, var(--titlebar-area-y, 0));
	left: var(--titlebar-area-x, 0);
	left: env(titlebar-area-x, var(--titlebar-area-x, 0));
	width: var(--titlebar-area-width, 100%);
	width: env(titlebar-area-width, var(--titlebar-area-width, 100%));
	height: var(--titlebar-area-height, 0);
	height: env(titlebar-area-height, var(--titlebar-area-height, 0));
	color-scheme: light dark;
	/* Max z-index minus 2*/
	z-index: 21478483654;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
}

* {
	box-sizing: inherit;
}

[part="container"] {
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	height: inherit;
	width: 100%;
	contain: strict;
}

@media (display-mode: browser) {
	::slotted([slot="titlebar"]) {
		display: none;
	}

	[part="grab-region"] {
		display: none;
	}
}

@media (display-mode: standalone) {
	[part="grab-region"] {
		flex-grow: 1;
		-webkit-app-region: drag;
		app-region: drag;
	}

	::slotted([slot="titlebar"]) {
		margin: 0;
		-webkit-app-region: no-drag;
		app-region: no-drag;
	}
}`;
