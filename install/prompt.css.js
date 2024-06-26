export default `:host {
	display: block;
	contain: strict;
	z-index: var(--z-top, 100);
	background-color: transparent;
	width: 100vw;
	height: 100vh;
	overflow: auto;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	box-sizing: border-box;
	background-color: rgba(0,0,0,0.7);
	text-align: left;
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
}

:host(:not([open])) {
	display: none;
}

:host([open]) #container {
	animation-name: open;
}

* {
	box-sizing: border-box;
}

[part="icon"] > * {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

#categories {
	list-style: none;
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	overflow-x: auto;
	gap: 8px;
}

#categories > [part="category"] {
	display: inline-block;
	color: var(--button-primary-color, #fefefe);
	background-color: var(--button-primary-background);
	padding: 6px 22px;
	border-radius: 20px;
}

button[data-platform="webapp"]:not([hidden]) {
	background-color: transparent;
	cursor: pointer;
	border: none;
}

[data-click="install"] {
	transition: opacity 500ms ease-in, filter 500ms ease-in;
}

[data-click="install"]:disabled {
	cursor: not-allowed;
	filter: grayscale(1);
	opacity: 0.7;
}

#header {
	grid-template-areas: "icon title close"
	"icon details install"
	"store-banner store-banner store-banner";
	grid-template-rows: 5vmax minmax(96px, auto) auto;
	grid-template-columns: 10vmax 1fr auto;
	grid-column-gap: 2em;
}

@media (max-width: 600px) {
	#header {
		grid-template-areas: "icon title title"
		"icon . install"
		"store-banner store-banner store-banner"
		"details details details";
		grid-template-rows: 10vmax auto auto auto;
		grid-template-columns: 10vmax 30px auto;
		grid-column-gap: 0.4em;
	}

	#title {
		text-align: center;
	}

	#details {
		padding-top: 16px;
		padding-bottom: 16px;
	}

	#close-btn-icon {
		display: none;
	}
}

#icon {
	grid-area: icon;
	font-size: 32px;
	color: #515151;
}

#install {
	grid-area: install;
	text-align: right;
}

#title {
	grid-area: title;
}

#details {
	grid-area: details;
	margin: 0;
}

#close-btn-icon {
	grid-area: close;
}

#container {
	border-radius: 12px;
	overflow-y: auto;
	overflow-x: hidden;
	position: absolute;
	left: 3vw;
	right: 3vw;
	top: 3vh;
	bottom: 5vh;
	height: 94vh;
	width: 94vw;
	box-sizing: border-box;
	background-color: #fafafa;
	padding: 24px;
	font-family: 'Roboto', sans-serif;
	color: #212121;
	animation-duration: 300ms;
	animation-timing-function: ease-in;
	margin-bottom: 25px;
}

[part="description"] {
	color: #646060;
}

#details::first-letter, #description::first-letter {
	margin-left: 1.2em;
}

#store-banners {
	grid-area: store-banner;
}

#platforms-container {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: space-around;
	margin-top: 12px;
}

#platforms-container > [data-platform] {
	margin-bottom: 8px;
	max-width: 45%;
}

#platforms-container > [data-platform]:not(:last-of-type) {
	margin-right: 8px;
}

@media (prefers-reduced-motion: reduce) {
	:host([open]) #container {
		animation-duration: 80ms;
	}
}

@media (prefers-color-scheme: dark) {
	#container {
		background-color: #232323;
		color: #fefefe;
	}

	[part="description"] {
		color: #bababa;
	}
}

[part~="store-badge"] {
	height: 53px;
	width: auto;
}

button:not([hidden]) {
	display: inline-block;
	cursor: pointer;
	background-color: var(--button-primary-background);
	color: var(--button-primary-color);
	border: var(--button-primary-border, 1px solid #aaa);
	border-radius: var(--button-border-radius, initial);
	box-sizing: border-box;
}

button:hover {
	background-color: var(--button-primary-hover-background, var(--button-primary-background));
	color: var(--button-primary-hover-color, var(--button-primary-color));
	border: var(--button-primary-hover-border, var(--button-primary-border, 0.2rem inset black));
}

button:active {
	background-color: var(--button-primary-active-background, var(--button-primary-background));
	color: var(--button-primary-active-color, var(--button-primary-color));
	border: var(--button-primary-active-border, var(--button-primary-border, 0.2rem inset black));
}

button:focus {
	outline-width: var(--focus-outline-width, 1px);
	outline-style: var(--focus-outline-style, dotted);
	outline-color: var(--focus-outline-color, currentColor);
}

.btn {
	padding: 8px 18px;
}

img {
	max-width: 100%;
}

#cancel-btn {
	border-radius: 18px;
	min-width: 10%;
	font-size: 20px;
	font-weight: bold;
	background-color: #cd3434;
	color: #fafafa;
	float: right;
	margin-top: 1.5em;
}

@media (max-width: 600px) {
	#cancel-btn {
		margin-left: auto;
		width: 80vw;
	}
}

.no-border, button.no-border {
	border: none;
}

.no-background, button.no-background {
	background: transparent;
}

.no-margin {
	margin: 0;
}

.color-inherit, button.color-inherit {
	color: inherit;
}

.grid {
	display: grid;
}

@media (min-width: 800px) {
	#details-container {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	[part="screenshots"] {
		max-width: 45%;
		object-fit: contain;
	}
}

.inline-block:not([hidden]) {
	display: inline-block;
}

.flex:not([hidden]) {
	display: flex;
}

.flex.row {
	flex-direction: row;
}

.flex.space-around {
	justify-content: space-around;
}

.float-right {
	float: right;
}

.icon, .icon * {
	color: inherit;
	max-width: 100%;
	max-height: 100%;
	width: auto;
	height: var(--icon-size, 1em);
	vertical-align: middle;
}

.current-color {
	fill: currentColor;
}

.clearfix::after {
	display: block;
	clear: both;
	content: "";
}

@keyframes open {
	from {
		opacity: 0.4;
		transform: scale(0.1);
	}

	to {
		opacity: 1;
		transform: none;
	}
}`;
