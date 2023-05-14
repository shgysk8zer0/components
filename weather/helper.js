import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { createSVG } from '@shgysk8zer0/kazoo/svg.js';
import { days } from '@shgysk8zer0/kazoo/date-consts.js';

export const ENDPOINT = 'https://api.openweathermap.org';
export const ICON_SRC = 'https://openweathermap.org/img/wn/';
export const VERSION = 2.5;
const TZ = '.' + new Date().toISOString().split('.').pop();

const dateString = date => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

export const shadows = new Map();

export function getSprite(icon) {
	// @SEE https://openweathermap.org/weather-conditions
	switch(icon) {
		case '01d': return 'weather-clear';
		case '01n': return 'weather-clear-night';
		case '02d':
		case '03d':
		case '04d': return 'weather-few-clouds';
		case '02n':
		case '03n':
		case '04n': return 'weather-few-clouds-night';
		case '09d':
		case '09n': return 'weather-showers-scattered';
		case '10d':
		case '10n': return 'weather-showers';
		case '11d':
		case '11n': return 'weather-storm';
		case '13d':
		case '13n': return 'weather-snow';
		case '50d':
		case '50n': return 'weather-fog';
		default: return 'weather-storm';
	}
}

export function getIconSrc(icon) {
	return new URL(`${icon}@2x.png`, ICON_SRC).href;
}

export function createIcon(symbol, owner = document) {
	const sprite = owner.getElementById(symbol);
	return createSVG({
		fill: 'currentColor',
		viewBox: sprite.getAttribute('viewBox'),
		role: 'presentation',
		children: [...sprite.children].map(node => node.cloneNode(true)),
	});
}

export function getIcon(icon) {
	const img = new Image();
	img.decoding = 'async';
	img.src = getIconSrc(icon);
	img.slot = 'icon';
	return img;
}

export async function getForecastByPostalCode(appid, postalCode, {
	units = 'imperial',
	country = 'us',
	lang = 'en',
	signal,
} = {}) {
	const { city = null, list = [] } = await getJSON(new URL(`/data/${VERSION}/forecast`, ENDPOINT), {
		body: { appid, zip: `${postalCode},${country}`, units, lang },
		signal,
	}) || {};

	const forecast = list.reduce((forecast, entry) => {
		const date = new Date(entry.dt_txt.replace(' ', 'T') + TZ);
		const day = dateString(date);

		if (! forecast.hasOwnProperty(day)) {
			forecast[day] = {
				day,
				dow: days[date.getDay()].name,
				date,
				high: Number.MIN_SAFE_INTEGER,
				low: Number.MAX_SAFE_INTEGER,
				times: [],
				conditions: null,
				icon: '01d',
			};
		}

		forecast[day].times.push({
			time: date.toLocaleTimeString(),
			conditions: entry.main,
			weather: entry.weather[0],
			cloud: entry.clouds,
			wind: entry.wind,
		});

		forecast[day].high = Math.max(forecast[day].high, entry.main.temp);
		forecast[day].low = Math.min(forecast[day].low, entry.main.temp);

		if (entry.weather[0].icon > forecast[day].icon) {
			forecast[day].icon = entry.weather[0].icon;
			forecast[day].conditions = entry.weather[0].description;
		}

		return forecast;
	}, {});

	return { city, forecast };
}

export async function getWeatherByPostalCode(appid, postalCode, {
	units = 'imperial',
	country = 'us',
	lang = 'en',
	signal,
} = {}) {
	return await getJSON(new URL(`/data/${VERSION}/weather`, ENDPOINT), {
		body: { appid, zip: `${postalCode},${country}`, units, lang },
		signal,
	});
}

export async function getSlot(el, name) {
	await el.ready;
	if (shadows.has(el)) {
		return shadows.get(el).querySelector(`slot[name="${name}"]`);
	} else {
		return null;
	}
}

export async function getAssigned(el, name) {
	const slot = await getSlot(el, name);
	if (slot instanceof HTMLElement) {
		return slot.assignedNodes();
	} else {
		return [];
	}
}

export async function clearSlot(el, name) {
	const assigned = await getAssigned(el, name);
	assigned.forEach(el => el.remove());
}

export async function clearSlots(el, ...names) {
	await el.ready;
	if (shadows.has(el)) {
		const shadow = shadows.get(el);
		names.forEach(name => {
			const slot = shadow.querySelector(`slot[name="${name}"]`);
			if (slot instanceof HTMLElement) {
				slot.assignedNodes().forEach(el => el.remove());
			}
		});

		return true;
	} else {
		return false;
	}
}
