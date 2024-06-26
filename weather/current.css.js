export default  `:host {
	display: inline-block;
	padding: 18px;
	font-size: 16px;
	overflow: hidden;
	max-width: 380px;
	--background: #fafafa;
	--color: #343434;
	background-color: var(--background);
	color: var(--color);
	border: 1px solid #dadada;
	border-radius: 6px;
	color-scheme: light dark;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	--background: #212121;
	--color: #fefefe;
	color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
	:host(:not([theme="light"])) {
		--background: #212121;
		--color: #fefefe;
	}
}

#wrapper {
	max-width: 380px;
	grid-template-areas: "city city city"
	"icon icon icon"
	"conditions . ."
	"temp . wind"
	". . updated"
	"credits credits credits";
	grid-template-rows: auto;
	grid-template-columns: 1fr 0 2fr;
	grid-gap: 0 1em;
	box-sizing: border-box;
}

@media (orientation: landscape) {
	#wrapper {
		grid-template-areas: "city city city"
		"icon conditions temp"
		"icon wind wind"
		"credits credits updated";
		grid-template-rows: auto minmax(4em, 1fr) minmax(2em, 1fr) auto;
		grid-template-columns: 96px auto auto;
	}
}

::slotted(svg[slot="icon"]) {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

#city {
	margin: 0;
	grid-area: city;
}

#current {
	grid-area: current;
}

#icon {
	grid-area: icon;
	padding: 10px;
}

#temp {
	grid-area: temp;
}

#wind {
	grid-area: wind;
}

#conditions {
	grid-area: conditions;
}

#updated {
	grid-area: updated;
}

#credits {
	grid-area: credits;
}

.grid {
	display: grid;
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

.no-overflow {
	overflow: hidden;
}

.overflow-x-auto {
	overflow-x: auto;
}

svg[hidden] {
	display: none;
}`;
