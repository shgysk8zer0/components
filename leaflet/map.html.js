export default `<div part="container">
<slot name="toolbar"></slot>
<slot name="map">
	<!-- Be sure to load Leaflet CSS if assigning this slot -->
	<div id="map-fallback" part="map"></div>
</slot>
<slot name="attribution">
	<a part="attribution" href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>
</slot>
<button part="btn fullscreen"></button>
<slot name="markers"></slot>
<slot name="overlays"></slot>
<slot name="geojson"></slot>
</div>`;
