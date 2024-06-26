export default `<div part="card" id="container">
	<slot name="header"></slot>
	<a class="clearfix color-inherit" part="link container github" href="" rel="noopener external">
		<img class="float-left" part="image avatar" decoding="async" loading="lazy" alt="avatar" crossorigin="anonymous" referrerpolicy="no-referrer" width="64" height="64" />
		<span class="inline-block float-left">
			<span class="inline-block" part="text name"></span>
			<br />
			@<span part="text username"></span>
		</span>
	</a>
	<blockquote part="text bio"></blockquote>
	<div part="location-container container">
		<slot name="location-icon">
			<svg part="icon location-icon" width="12" height="16" viewBox="0 0 12 16" aria-label="Location">
				<path fill-rule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"/>
			</svg>
		</slot>
		<span part="text location"></span>
	</div>
	<div part="email-container container">
		<slot name="email-icon">
			<svg part="icon email-icon" width="14" height="16" viewBox="0 0 14 16" aria-label="Email">
				<path fill-rule="evenodd" d="M0 4v8c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1zm13 0L7 9 1 4h12zM1 5.5l4 3-4 3v-6zM2 12l3.5-3L7 10.5 8.5 9l3.5 3H2zm11-.5l-4-3 4-3v6z"/>
			</svg>
		</slot>
		<a href="" class="color-inherit" part="text link email"></a>
	</div>
	<div part="company-container">
		<slot name="company-icon">
			<svg part="icon company-icon" width="16" height="16" viewBox="0 0 16 16" aria-label="Organization">
				<path fill-rule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z"/>
			</svg>
		</slot>
		<a href="" class="color-inherit" part="text link company" rel="noopener external"></a>
	</div>
	<div part="blog-container">
		<slot name="blog-icon">
			<svg part="icon blog-icon" width="16" height="16" viewBox="0 0 16 16" aria-label="Website">
				<path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"/>
			</svg>
		</slot>
		<a href="" class="color-inherit" part="blog" rel="noopener external"></a>
	</div>
	<slot name="footer"></slot>
</div>`;
