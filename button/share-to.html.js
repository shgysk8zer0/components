export default `<div part="container" aria-hidden="true">
	<span part="icon facebook-icon">
		<slot name="facebook-icon">
			<img src="https://cdn.kernvalley.us//img/logos/mono/light/facebook.svg" width="32" height="32" crossorigin="anonymous" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" />
		</slot>
	</span>
	<span part="icon twitter-icon">
		<slot name="twitter-icon">
			<img src="https://cdn.kernvalley.us//img/logos/mono/light/twitter.svg" width="32" height="32" crossorigin="anonymous" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" />
		</slot>
	</span>
	<span part="icon reddit-icon">
		<slot name="reddit-icon">
			<img src="https://cdn.kernvalley.us//img/logos/mono/light/reddit.svg" width="32" height="32" crossorigin="anonymous" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" />
		</slot>
	</span>
	<span part="icon linkedin-icon">
		<slot name="linkedin-icon">
			<img src="https://cdn.kernvalley.us//img/logos/mono/light/linkedin.svg" width="32" height="32" crossorigin="anonymous" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" />
		</slot>
	</span>
	<span part="icon email-icon">
		<slot name="email-icon">
			<svg class="current-color" width="28" height="32" fill="currentColor" viewBox="0 0 14 16" role="img" aria-hidden="true">
				<path fill-rule="evenodd" d="M0 4v8c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1zm13 0L7 9 1 4h12zM1 5.5l4 3-4 3v-6zM2 12l3.5-3L7 10.5 8.5 9l3.5 3H2zm11-.5l-4-3 4-3v6z"/>
			</svg>
		</slot>
	</span>
	<span part="icon pinterest-icon">
		<slot name="pinterest-icon">
			<img src="https://cdn.kernvalley.us//img/logos/mono/light/pinterest.svg" width="32" height="32" crossorigin="anonymous" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" />
		</slot>
	</span>
	<span part="icon tumblr-icon">
		<slot name="tumblr-icon">
			<img src="https://cdn.kernvalley.us//img/logos/mono/light/tumblr.svg" width="32" height="32" crossorigin="anonymous" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" />
		</slot>
	</span>
	<span part="icon telegram-icon">
		<slot name="telegram-icon">
			<img src="https://cdn.kernvalley.us//img/logos/telegram-flat.svg" width="32" height="32" crossorigin="anonymous" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" />
		</slot>
	</span>
	<span part="icon clipboard-icon">
		<slot name="clipboard-icon">
			<svg class="current-color" width="28" height="32" fill="currentColor" viewBox="0 0 14 16" role="img" aria-hidden="true">
				<path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/>
			</svg>
		</slot>
	</span>
	<span part="icon print-icon">
		<slot name="print-icon">
			<svg class="current-color" width="32" height="32" viewBox="0 0 16 16" role="img" aria-hidden="true">
					<path d="M2 4c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1h1V8h10v2h1c.5 0 1-.5 1-1V5c0-.5-.5-1-1-1zm2-3v2h8V1z"/>
					<path d="M4 9v5h8V9z"/>
			</svg>
		</slot>
	</span>
	<span part="icon gmail-icon">
		<slot name="gmail-icon">
			<img src="https://cdn.kernvalley.us//img/logos/gmail.svg" width="32" height="32" crossorigin="anonymous" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" />
		</slot>
	</span>
	<span class="inline-block" part="spacer">&nbsp;</span>
	<span part="text">
		<slot name="text">
			<span class="inline-block">
				<div part="share-text" class="mobile-hidden">Share on</div>
				<div id="network" part="network">Unknown</div>
			</span>
		</slot>
	</span>
</div>`;
