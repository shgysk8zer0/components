export default `:host {
	display: inline-block;
	box-sizing: border-box;
	width: 300px;
	max-width: 100%;
	min-height: 80px;
	overflow: hidden;
	contain: strict;
	text-align: left;
	font-size: 18px;
}

:host([large]) {
	height: 380px;
}

@supports selector(:popover-open) {
	:host([popover]:not(:popover-open)) {
		display: none;
	}

	:host([popover]) {
		margin: unset;
		inset: auto 8px 0 auto;
		border: none;
		padding: 0;
	}
}

:host([uri^="spotify:show:"]),
:host([link^="https://open.spotify.com/show"]) {
	min-width: 360px;
	height: 232px;
}

:host([uri^="spotify:show:"]) ::slotted(iframe),
:host([link^="https://open.spotify.com/show"]) ::slotted(iframe) {
	height: 232px;
}

::slotted(iframe) {
	border: none;
	width: 100%;
}

* {
	box-sizing: inherit;
}

.current-color {
	fill: currentColor;
}

.inline-block {
	display: inline-block;
}

.clearfix::after {
	display: block;
	clear: both;
	content: "";
}

[part~="fallback"] {
	color: #fefefe;
	background-image: linear-gradient(#929292, #282828);
	display: flex;
	flex-direction: row;
}

[part~="fallback-icon"] {
	height: 68px;
	width: 68px;
	padding: 12px;
	flex: 80px 0 0;
}

[part~="fallback-body"] {
	height: 80px;
	flex: 220px 0 0;
	padding-top: calc(40px - 0.5em);
	font-weight: 600;
	text-align: center;
}`;
