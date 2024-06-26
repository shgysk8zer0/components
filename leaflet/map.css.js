export default `:host {
	display: inline-block;
	height: var(--map-height, 400px);
	width: var(--map-width, 600px);
	contain: strict;
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
}

[part~="container"] {
	position: relative;
	height: var(--map-height, 400px);
	width: var(--map-width, 600px);
	contain: strict;
}

:host([toolbar]) ::slotted([slot="toolbar"]) {
	display: inline-flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 0.4em;
	overflow-y: hidden;
	height: var(--map-toolbar-height, 4rem);
	position: fixed;
	z-index: 401;
	top: 0;
	right: 0;
	opacity: 0.2;
	transition: opacity 400ms ease-in-out;
}

:host([toolbar]) ::slotted([slot="toolbar"]:hover) {
	opacity: 1;
}

:host(:fullscreen) [part~="container"], :host(:fullscreen) ::slotted([slot="map"]),
:host(:fullscreen) #map-fallback {
	width: 100%;
	height: 100%;
}

:host(:not([allowfullscreen]):not([allowlocate])) [part~="other-controls"] {
	display: none;
}

:host(:not([zoomcontrol])) [part~="zoom-controls"] {
	display: none;
}

:host(:not([allowlocate])) [part~="locate-btn"] {
	display: none;
}

:host(:not([allowfullscreen])) [part~="fullscreen-btn"] {
	display: none;
}

:host(:fullscreen) slot[name="enter-fullscreen-icon"] {
	display: none;
}

:host(:not(:fullscreen)) slot[name="exit-fullscreen-icon"] {
	display: none;
}

* {
	box-sizing: border-box;
}

#map-fallback, ::slotted([slot="map"]) {
	height: var(--map-height, 400px);
	width: var(--map-width, 600px);
}

::slotted([slot="markers"]), ::slotted([slot="attribution"]),
::slotted([slot="icon"]), slot[name="attribution"], ::slotted([slot="overlays"]),
::slotted([slot="geojson"]) {
	display: none;
}

slot[name="map"] {
	contain: content;
}

[slot="popup"] img, [slot="popup"] svg {
	max-width: 100%;
	height: auto;
}

[slot="popup"] pre {
	max-width: 100%;
	overflow: auto;
}

[part~="popup"] {
	max-height: var(--marker-max-height, calc(0.6 * var(--map-height, 400px)));
	overflow: auto;
}

[part~="control-btn"] {
	width: 35px;
	height: 35px;
	line-height: 35px;
}

slot svg.icon {
	vertical-align: middle;
}

.leaflet-popup-content img {
	max-width: 100%;
}

@media (prefers-color-scheme: dark) {
	.leaflet-popup-content-wrapper, .leaflet-popup-tip {
		background-color: #212121;
		color: #fefefe;
		box-shadow: 0 3px 14px rgba(0,0,0,0.4);
	}
}`;
