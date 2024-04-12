import { createElement, createImage } from '@shgysk8zer0/kazoo/elements.js';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { registerCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { getString, setString, getBool, setBool } from '@shgysk8zer0/kazoo/attrs.js';
import { whenIntersecting } from '@shgysk8zer0/kazoo/intersect.js';
import {
	createThumbsUpIcon, createThumbsDownIcon, createLinkExternalIcon, createCommentIcon,
	createCalendarIcon, createPersonIcon,
} from '@shgysk8zer0/kazoo/icons.js';

import styles from './posts.css.js';

const DATE_FORMAT = {
	weekday: 'short',
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
};

async function getPosts({ subreddit }, { signal } = {}) {
	if (sessionStorage.hasOwnProperty(subreddit)) {
		return JSON.parse(sessionStorage.getItem(subreddit));
	} else {
		const url = new URL(`${subreddit}.json`, 'https://www.reddit.com/r/');
		const { data: { children: posts }} = await getJSON(url, { signal });
		sessionStorage.setItem(subreddit, JSON.stringify(posts));
		return posts;
	}
}

const protectedData = new WeakMap();

registerCustomElement('reddit-posts', class HTMLRedditPostsElement extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });
		const container = createElement('div', { part: ['container'], classList: ['container'] });
		shadow.append(container);
		protectedData.set(this, { shadow, container });
	}

	async connectedCallback() {
		await whenIntersecting(this);
		const { shadow } = protectedData.get(this);

		shadow.adoptedStyleSheets = [styles];
		await this.render();
	}

	async render({ signal } = {}) {
		const posts = await getPosts(this, { signal });
		const nsfw = this.nsfw;
		protectedData.get(this).container.replaceChildren(...posts
			.filter(({ hidden, over_18 }) => ! (hidden || (!nsfw & over_18)))
			.map(({ data: {
				title,
				selftext: text = '',
				permalink: url,
				thumbnail,
				thumbnail_width = 0,
				created_utc: dateCreated,
				num_comments: commentCount,
				author,
				ups,
				downs,
			}}) => {
				const post = createElement('div', {
					part: ['post'],
					classList: ['post'],
					'@type': 'SocialMediaPosting',
					children: [
						createElement('a', {
							href: new URL(url, 'https://www.reddit.com'),
							itemprop: 'url',
							part: ['post-link'],
							classList: ['link'],
							rel: 'noopener noreferrer external',
							children: [
								createElement('span', {
									part: ['post-title'],
									classList: ['title'],
									text: title,
									itemprop: 'headline',
								}),
								createLinkExternalIcon({
									size: 20,
									fill: 'currentColor',
									part: ['icon', 'link-icon'],
									classList: ['icon', 'link-icon'],
								}),
							]
						}),
						createElement('div', {
							children: [
								createCalendarIcon({
									fill: 'currentColor',
									size: 18,
									part: ['icon', 'post-created-icon'],
									classList: ['icon', 'posted-icon'],
									role: 'image',
									ariaLabel: 'Posted on',
								}),
								createElement('date', {
									datetime: new Date(dateCreated * 1000).toISOString(),
									itemprop: 'dateCreated',
									text: new Intl.DateTimeFormat(navigator.language, DATE_FORMAT)
										.format(new Date(dateCreated * 1000)),
								})
							]
						}),
						createElement('div', {
							part: ['post-author'],
							classList: ['author'],
							itemprop: 'author',
							'@type': 'Person',
							children: [
								createElement('a', {
									href: new URL(author, 'https://www.reddit.com/u/'),
									rel: 'noopener noreferrer external',
									itemprop: 'url',
									part: ['post-author'],
									classList: ['author'],
									children: [
										createPersonIcon({
											size: 18,
											fill: 'currentColor',
											part: ['icon', 'post-author-icon'],
											classList: ['icon', 'author-icon'],
										}),
										createElement('span', {
											itemprop: 'name',
											text: `/u/${author}`,
										})
									]
								})
							]
						})
					]
				});

				if (typeof thumbnail === 'string' && URL.canParse(thumbnail)) {
					post.append(createImage(thumbnail, {
						width: thumbnail_width,
						part: ['post-image'],
						classList: ['image'],
						loading: 'lazy',
						referrerPolicy: 'no-referrer',
						itemprop: 'image'
					}));
				}

				if (typeof text === 'string' && text.length !== 0) {
					post.append(createElement('blockquote', {
						part: ['post-text'],
						classList: ['text'],
						text: text.length > 140 ? `${text.substr(0, 140)}...` : text,
						itemprop: 'articleBody',
					}));
				}

				post.append(createElement('div', {
					part: ['post-meta'],
					classList: ['meta'],
					children: [
						createElement('span', {
							part: ['post-ups'],
							classList: ['upvotes'],
							children: [
								createThumbsUpIcon({
									fill: 'currentColor',
									size: 18,
									part: ['icon', 'upvote-icon'],
									classList: ['icon', 'upvote-icon'],
									role: 'image',
									ariaLabel: 'Upvote count',
								}),
								createElement('span', { text: ups.toString() }),
							]
						}),
						createElement('span', {
							part: ['post-downs'],
							classList: ['downvotes'],
							children: [
								createThumbsDownIcon({
									fill: 'currentColor',
									size: 18,
									part: ['icon', 'downvote-icon'],
									role: 'image',
									ariaLabel: 'Downvote count',
									classList: ['icon', 'downvote-icon'],
								}),
								createElement('span', { text: downs.toString() }),
							]
						}),
						createElement('span', {
							part: ['post-comments'],
							classList: ['comments'],
							children: [
								createCommentIcon({
									fill: 'currentColor',
									size: 18,
									part: ['icon', 'comments-icon'],
									classList: ['comments-icon'],
									role: 'image',
									ariaLabel: 'Comment count',
								}),
								createElement('span', {
									text: commentCount.toString(),
									itemprop: 'commentCount',
								}),
							]
						}),
					]
				}));

				return post;
			})
		);
	}

	get nsfw() {
		return getBool(this, 'nsfw');
	}

	set nsfw(val) {
		setBool(this, 'nsfw', val);
	}

	get subreddit() {
		return getString(this, 'subreddit');
	}

	set subreddit(val) {
		setString(this, 'subreddit', val);
	}
});
