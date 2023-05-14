import { geoJSON } from 'leaflet';
import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';

const map = new Map();
const MIME_TYPE = 'application/geo+json';
import {
	getInt, setInt, getString, setString, getBool, setBool, getFloat, setFloat,
	getURL, setURL,
} from '@shgysk8zer0/kazoo/attrs.js';

registerCustomElement('leaflet-geojson', class HTMLLeafletGeoJSONElement extends HTMLElement {
	constructor() {
		super();
		this._map = null;
		this.attachShadow({ mode: 'open' });
		const slot = document.createElement('slot');
		slot.name = 'data';

		slot.addEventListener('slotchange', async () => {
			await this.whenConnected;
			const parent = this.parentElement;
			const current = map.get(this);

			if (current) {
				current.remove();
				map.delete(this);
			}

			const { color, weight, fill, opacity, stroke, data } = this;


			if (data) {
				const path = geoJSON(data, { style: { color, weight, fill, opacity, stroke }});
				map.set(this, path);

				if (parent.tagName === 'LEAFLET-MAP' && this.hidden === false) {
					customElements.whenDefined('leaflet-map').then(() => {
						parent.ready.then(() => path.addTo(parent.map));
					});
				}

				this.dispatchEvent(new Event('ready'));
			}
		});

		this.shadowRoot.append(slot);
		this.whenConnected.then(() => this.slot = 'geojson');
	}

	get color() {
		return getString(this, 'color', { fallback: '#ff7800' });
	}

	set color(val) {
		setString(this, 'color', val);
	}

	get data() {
		const slot = this.shadowRoot.querySelector('slot[name="data"]');
		const slotted = slot.assignedElements();

		if (slotted.length === 1) {
			const script = slotted[0];
			if (script instanceof HTMLScriptElement) {
				return JSON.parse(script.text);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	set data(val) {
		if (val instanceof Response) {
			val.text().then(data => this.data = data);
		} else if (val instanceof File) {
			val.text().then(txt => this.data = txt);
		} else if (typeof val === 'string') {
			const script = document.createElement('script');
			const current = this.querySelectorAll('[slot="data"]');
			script.slot = 'data';
			script.setAttribute('type', MIME_TYPE);
			script.textContent = val;

			if (current.length === 1) {
				current.item(0).replaceWith(script);
			} else {
				[...current].forEach(el => el.remove());
				this.append(script);
			}
		} else {
			this.data = JSON.stringify(val);
		}
	}

	get fill() {
		return getBool(this, 'color');
	}

	set fill(val) {
		setBool(this, 'fill', val);
	}

	get marker() {
		if (this.parentElement.tagName === 'LEAFLET-MARKER') {
			return this.parentElement;
		} else if (this.hasAttribute('marker')) {
			return document.getElementById(this.getAttribute('marker'));
		} else {
			return null;
		}
	}

	set marker(val) {
		setString(this, 'marker', val);
	}

	get opacity() {
		return getFloat(this, 'opacity', { min: 0, max: 1 });
	}

	set opacity(val) {
		setFloat(this, 'opacity', val );
	}

	get ready() {
		if (map.has(this)) {
			return Promise.resolve();
		} else {
			return new Promise(resolve => {
				this.addEventListener('ready', () => resolve(), { once: true });
			});
		}
	}

	get src() {
		return getURL(this, 'src');
	}

	set src(val) {
		setURL(this, 'src', val);
	}

	get stroke() {
		return getBool(this, 'stroke');
	}

	set stroke(val) {
		setBool(this, 'stroke', val);
	}

	get weight() {
		return getInt(this, 'weight', { fallback: 5 });
	}

	set weight(val) {
		setInt(this, 'weight',{ min: 0 });
	}

	get whenConnected() {
		if (this.isConnected) {
			return Promise.resolve();
		} else {
			return new Promise(resolve => {
				this.addEventListener('connect', () => resolve(), { once: true });
			});
		}
	}

	async attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'color':
				this.ready.then(() => {
					map.get(this).setStyle({ color: this.color });
				});
				break;

			case 'fill':
				this.ready.then(() => {
					map.get(this).setStyle({ fill: this.fill });
				});
				break;

			case 'hidden':
				this.ready.then(() => {
					if (this.hidden) {
						map.get(this).remove();
					} else if (this._map instanceof HTMLElement) {
						map.get(this).addTo(this._map.map);
					}
				});
				break;

			case 'opacity':
				this.ready.then(() => {
					map.get(this).setStyle({ opacity: this.opacity });
				});
				break;

			case 'stroke':
				this.ready.then(() => {
					map.get(this).setStyle({ stroke: this.stroke });
				});
				break;

			case 'src':
				this.dispatchEvent(new CustomEvent('srcchange', { detail: { oldVal, newVal }}));

				if (typeof newVal === 'string' && newVal.length !== 0) {
					fetch(new URL(newVal, document.baseURI))
						.then(resp => this.data = resp);
				}
				break;

			case 'weight':
				this.ready.then(() => {
					map.get(this).setStyle({weight: this.weight});
				});
				break;

			default:
				throw new Error(`Invalid attribute changed: ${name}`);
		}
	}

	async connectedCallback() {
		this.dispatchEvent(new Event('connected'));
		const closestMap = this.closest('leaflet-map');

		if (closestMap instanceof HTMLElement) {
			await customElements.whenDefined('leaflet-map');
			await closestMap.ready;
			this._map = closestMap;
			const marker = this.marker;

			if (marker instanceof HTMLElement) {
				marker.addEventListener('markerclick', () => this.toggleAttribute('hidden'));
			}
		}
	}

	async disconnectedCallback() {
		if (this._map instanceof HTMLElement) {
			await this._map.ready;
			const path = map.get(this);
			path.remove();
			map.delete(this);
			this._map = null;
		}
	}

	static get observedAttributes() {
		return [
			'color',
			'fill',
			'hidden',
			'opacity',
			'src',
			'stroke',
			'weight',
			'marker',
		];
	}
});
