export default `:host {
	display: block;
	overflow: auto;
	--background-color: #fafafa;
	--color: #343434;
	border: 1px solid #dadada;
	border-radius: 6px;
	max-width: 100%;
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	--background-color: #212121;
	--color: #fefefe;
}

@media (prefers-color-scheme: dark) {
	:host(:not([theme="light"])) {
		--background-color: #212121;
		--color: #fefefe;
	}
}

* {
	box-sizing: inherit;
}

#wrapper {
	max-width: 100vw;
	overflow-x: auto;
	padding: 1.2rem 0.8rem;
	box-sizing: border-box;
	border-radius: 6px;
	background-color: var(--background);
	color: var(--color);
}

.inline-grid {
	display: inline-grid;
}

.inline-block {
	display: inline-block;
}

.float-right {
	float: right;
}

.clearfix::after {
	display: block;
	content: '';
	clear: both;
}

.center {
	text-align: center;
}

.capitalize {
	text-transform: capitalize;
}

.color-inherit {
	color: inherit;
}

.current-color {
	fill: currentColor;
}

.overflow-x-auto {
	overflow-x: auto;
}

.cell {
	width: 25ch;
	padding: 0.4em;
}

.day slot[name="icon"], ::slotted(svg) {
	width: 12ch;
	height: auto;
}

.summary{
	height: 2.3em;
	overflow: hidden;
}

.high-low {
	color: #fefefe;
	padding: 0.3em 0.8em;
	border-radius: 3px;
	text-align: center;
	display: block;
}

.high {
	background-color: rgb(232, 68, 68);
}

.low {
	background-color: rgb(76, 76, 200);
	margin-top: 8px;
}

svg[hidden] {
	display: none;
}`;
