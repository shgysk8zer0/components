export default `:host {
	position: fixed;
	display: inline-grid;
	padding: 12px 20px 8px 8px;
	font-size: 18px;
	grid-template-areas: "icon title badge ."
	"icon body body body"
	". body body body"
	"image image image image"
	"actions actions actions actions";
	grid-template-rows: 32px 32px auto auto;
	grid-template-columns: auto 1fr 25px 25px;
	column-gap: 8px;
	row-gap: 6px;
	bottom: 1.2em;
	right: 1.2em;
	background: white;
	border: 1px solid #cecece;
	border-radius: 4px;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
	width: 320px;
	min-height: 64px;
	box-sizing: border-box;
	overflow-y: hidden;
	z-index: 2147483647;
	animation: NotificationFadeIn 300ms ease-in;
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
}

@media (max-width: 550px) {
	:host {
		left: 20px;
		right: 20px;
		width: calc(100% - 40px);
	}
}

@media (prefers-color-scheme: dark) {
	:host {
		background: #232323;
		color: #dedede;
		border-color: #6a6a6a;
	}
}

[part="icon"] {
	grid-area: icon;
}

[part="badge"] {
	grid-area: badge;
}

[part="image"] {
	grid-area: image;
}

[part="title"] {
	grid-area: title;
	padding: 0;
	margin: 0;
	font-size: 0.9em;
}

[part="body"] {
	grid-area: body;
	overflow: auto;
	margin: 0;
	padding: 0;
	display: block;
	max-height: 120px;
	scrollbar-width: thin;
}

[part="close"] {
	position: absolute;
	top: 8px;
	right: 8px;
	background: transparent;
	border: none;
	cursor: pointer;
	color: inherit;
}

[part="actions"] {
	grid-area: actions;
	display: flex;
	justify-content: space-around;
}

::slotted([slot="body"]) {
	margin: 0;
	padding: 0;
	overflow: auto;
	display: inline-block;
	line-height: 1.2;
}

::slotted([slot="image"]) {
	width: 100%;
}

::slotted([slot="icon"]) {
	height: 64px;
	width: 64px;
}

::slotted([slot="actions"]) {
	text-align: center;
	background: none !important;
	color: inherit !important;
	padding: 0 !important;
	margins: 0 !important;
	border: none;
	cursor: pointer;
}

@keyframes NotificationFadeIn {
	from {
		opacity: 0.1;
		transform: translateY(64px);
	}

	to {
		opacity: 1;
		transform: none;
	}
}`;
