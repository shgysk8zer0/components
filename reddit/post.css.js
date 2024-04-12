export default `:host {
	display: block;
	max-width: 100%;
}

.post {
	border: 1px solid #dadada;
	border-radius: 10px;
	padding: 1.3em;
	margin: 16px 8px;
	max-width: 400px;
	width: 100%;
	width: clamp(320px, 400px, 100%);
	box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
	box-sizing: border-box;
}

.image {
	margin: 8px auto;
	display: block;
	border-radius: 4px;
}

.link {
	color: inherit;
	margin: 0 auto;
	display: block;
}

.title {
	font-size: 1.3em;
	font-weight: bold;
}

.meta {
	display: flex;
	margin-top: 1.2em;
	justify-content: center;
	gap: 18px;
}

.author {
	color: inherit;
}

.icon {
	vertical-align: baseline;
	height: 1em;
	width: auto;
}

.link-icon, .upvote-icon, .downvote-icon, .comments-icon, .posted-icon, .author-icon {
	margin: 0 0.4em;
}`;
