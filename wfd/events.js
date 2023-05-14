import { getEvents as getAllEvents } from '@shgysk8zer0/kazoo/krv/wfd.js';
import { createElement } from '@shgysk8zer0/kazoo/elements.js';
import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { whenIntersecting } from '@shgysk8zer0/kazoo/intersect.js';
import { text, attr } from '@shgysk8zer0/kazoo/dom.js';
import { days } from '@shgysk8zer0/kazoo/date-consts.js';
import { getHTML } from '@shgysk8zer0/kazoo/http.js';
import { getURLResolver, setUTMParams, callOnce } from '@shgysk8zer0/kazoo/utility.js';
import { meta } from '../import.meta.js';
import { loadStylesheet } from '@shgysk8zer0/kazoo/loader.js';
import { createPolicy } from '@shgysk8zer0/kazoo/trust.js';
import { getString, setString, getBool, setBool } from '@shgysk8zer0/kazoo/attrs.js';

const protectedData = new WeakMap();
const policy = createPolicy('wfd-events#html', { createHTML: input => input });
export const trustPolicies = [policy.name];
const WFD = 'https://whiskeyflatdays.com/';
const medium = 'referral';
const content = 'wfd-events';
const sanitizer = new Sanitizer();
const resolveURL = getURLResolver({ base : meta.url, path: './wfd/' });
const getTemplate = callOnce(() => getHTML(resolveURL('events.html'), { policy }));
const getEvents = callOnce(() => getAllEvents());

function getWFDLink(path, params) {
	return setUTMParams(new URL(path, WFD), params);
}

registerCustomElement('wfd-events', class HTMLWFDEventsElement extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });

		shadow.append(
			createElement('a', {
				href: getWFDLink('', { source: this.source, medium, content }),
				target: '_blank',
				rel: 'noopener noreferrer external',
				part: ['text', 'link'],
				children: [
					createElement('slot', {
						name: 'label',
						children: [createElement('h2', { text: 'Whiskey Flat Days Events' })],
					}),
				]
			}),
			createElement('div', { part: ['list'] }),
		);

		protectedData.set(this, { shadow });
	}

	async connectedCallback() {
		await whenIntersecting(this);
		const { shadow } = protectedData.get(this);
		const [events, tmp] = await Promise.all([
			getEvents(),
			getTemplate(),
			loadStylesheet(resolveURL('events.css'), { parent: shadow }),
		]);
		const source = this.source;

		shadow.querySelector('[part~="list"]').replaceChildren(...events.map(({
			'@identifier': identifier,
			'@type': type,
			'@context': context,
			name,
			description,
			image = '/img/markers/activity.svg',
			url,
			startDate,
			endDate,
			location: {
				'name': placeName,
				'@type': placeType,
				'geo': {
					latitude,
					longitude,
				}
			}
		}) => {
			const start = new Date(startDate);
			const end = new Date(endDate);
			const base = tmp.cloneNode(true);
			const utm = { source, medium, content };

			attr('[part~="event"]', { itemtype: new URL(type, context) }, { base });
			attr('[part~="link"]', { href: getWFDLink(url, utm) }, { base });
			attr('[itemprop="image"]', { src: image }, { base });
			attr('[itemprop="startDate"]', { datetime: start },{ base });
			attr('[itemprop="endDate"]', { datetime: end }, { base });
			attr('[itemprop="longitude"]', { content: longitude }, { base });
			attr('[itemprop="latitude"]', { content: latitude }, { base });
			attr('[itemprop="location"]', { itemtype: new URL(placeType, 'https://schema.org/') }, { base });
			attr('[itemprop="location"] [itemprop="url"]', { href: getWFDLink(`/map/#${identifier}`, utm )}, { base });

			text('[itemprop="startDate"]', `${days[start.getDay()].short}. ${start.toLocaleTimeString().replace(':00 ', ' ')}`, { base });
			text('[itemprop="endDate"]', end.toLocaleTimeString().replace(':00 ', ' '), { base });
			text('[part~="name"]', name, { base });
			text('[itemprop="location"] [itemprop="name"]', placeName.length === 0 ? 'Kernville' : placeName, { base });

			if (typeof description === 'string') {
				try {
					base.querySelector('[itemprop="description"]').setHTML(description, { sanitizer });
				} catch(e) {
					console.error(e);
				}
			}

			return base;
		}));
	}

	get images() {
		return getBool(this, 'images');
	}

	set images(val) {
		setBool(this, 'images', val);
	}

	get source() {
		return getString(this, 'source');
	}

	set source(val) {
		setString(this, 'source', val);
	}

	get theme() {
		return getString(this, 'theme', { fallback: 'auto' });
	}

	set theme(val) {
		setString(this, 'theme', val);
	}
});
