import { getInt, setInt, getString, setString, getBool, setBool } from '@shgysk8zer0/kazoo/attrs.js';
import { createGoogleCalendar } from '@shgysk8zer0/kazoo/google/calendar.js';

const part = ['embed'];

class HTMLGoogleCalendarElement extends HTMLElement {
	#shadow;
	#internals;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#internals = this.attachInternals();
	}

	connectedCallback() {
		this.render();
	}

	async render() {
		const { width, height, calendarId, loading, mode, showTabs, showPrint, showCalendars, showTimezone } = this;
		const { resolve, reject, promise } = Promise.withResolvers();
		const controller = new AbortController();
		const signal = controller.signal;

		this.#shadow.replaceChildren(createGoogleCalendar(calendarId, {
			width, height, loading, mode, showTabs, showPrint, showCalendars,
			showTimezone, part,
			events: {
				signal,
				load: () => {
					resolve(this);
					controller.abort();
				},
				error: () => {
					const err = new DOMException('Error loading calendar.');
					reject(err);
					controller.abort(err);
				}
			},
		}));

		return await promise;
	}

	get calendarId() {
		return this.getAttribute('calendarid');
	}

	set calendarId(val) {
		this.setAttribute('calendarid', val);
	}

	get mode() {
		return getString(this, 'mode', { fallback: 'AGENDA' })?.toUpperCase();
	}

	set mode(val) {
		setString(this, 'mode', val);
	}

	get showCalendars() {
		return getBool(this, 'showcalendars');
	}

	set showCalendars(val) {
		setBool(this, 'showcalendars', val);
	}

	get showPrint() {
		return getBool(this, 'showprint');
	}

	set showPrint(val) {
		setBool(this, 'showprint', val);
	}

	get showTabs() {
		return getBool(this, 'showtabs');
	}

	set showTabs(val) {
		setBool(this, 'showtabs', val);
	}

	get showTimezone() {
		return getBool(this, 'showtimezone');
	}

	set showTimezone(val) {
		setBool(this, 'showtimezone', val);
	}

	get height() {
		return getInt(this, 'height', { fallback: 600 });
	}

	set height(val) {
		setInt(this, 'height', val, { min: 1 });
	}

	get width() {
		return getInt(this, 'width', { fallback: 800 });
	}

	set width(val) {
		setInt(this, 'width', val, { min: 1 });
	}

	get loading() {
		return getString(this, 'loading', { fallback: 'auto' });
	}

	set loading(val) {
		setString(this, 'loading', val);
	}
}

customElements.define('google-calendar', HTMLGoogleCalendarElement);
