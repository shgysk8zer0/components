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
	box-sizing: border-box;
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
}

[part~="link"] {
	text-decoration: underline;
	color: inherit;
}

svg {
	color: inherit;
	fill: currentColor;
	vertical-align: middle;
	width: 1em;
	height: 1em;
}

[part~="profile-link"] {
	gap: 0.7em;
}

[part~="avatar"] > img {
	vertical-align: middle;
	border-radius: 50%;
}

.underline {
	text-decoration: underline;
}

.color-inherit {
	color: inherit;
}

.flex {
	display: flex;
}

.flex.row {
	flex-direction: row;
}

.flex.wrap {
	flex-wrap: wrap;
}`;
