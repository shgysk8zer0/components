export default `<div part="container">
	<header part="repo">
		<h4 part="repo-header">
			<a href="" part="repo-link link">
				<slot name="repo-icon">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-label="Repository">
						<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
					</svg>
				</slot>
				<span part="name">Unknown Repo</span>
			</a>
		</h4>
		<blockquote part="description"></blockquote>
		<section part="homepage" hidden="">
			<a part="homepage-url link" rel="noopener noreferrer external">
				<slot name="homepage-icon">
					<svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-label="Homepage">
						<path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"/>
					</svg>
				</slot>
				<span part="homepage-text"></span>
			</a>
		</section>
		<section part="issues" hidden="">
			<a href="" rel="noopener noreferrer external" part="issues-link link">
				<svg part="issues-icon icon" width="14" height="16" fill="currentColor" viewBox="0 0 14 16" aria-hidden="true">
					<path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"/>
				</svg>
				<span part="issue-count">0</span>
				<span>Issues</span>
			</a>
		</section>
		<section part="license" hidden="">
			<a part="license-url link" rel="noopener noreferrer external">
				<slot name="license-icon">
					<svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-label="License">
						<path fill-rule="evenodd" d="M7 4c-.83 0-1.5-.67-1.5-1.5S6.17 1 7 1s1.5.67 1.5 1.5S7.83 4 7 4zm7 6c0 1.11-.89 2-2 2h-1c-1.11 0-2-.89-2-2l2-4h-1c-.55 0-1-.45-1-1H8v8c.42 0 1 .45 1 1h1c.42 0 1 .45 1 1H3c0-.55.58-1 1-1h1c0-.55.58-1 1-1h.03L6 5H5c0 .55-.45 1-1 1H3l2 4c0 1.11-.89 2-2 2H2c-1.11 0-2-.89-2-2l2-4H1V5h3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1h3v1h-1l2 4zM2.5 7L1 10h3L2.5 7zM13 10l-1.5-3-1.5 3h3z"/>
					</svg>
				</slot>
				<span part="license-name">Unknown License</span>
			</a>
		</section>
	</header>
	<section part="user">
		<h4>
			<slot name="user-heading">Create by</slot>
		</h4>
		<a part="profile-link link" href="" rel="noopener external" class="flex row wrap">
			<span part="avatar"></span>
			<b part="username">Unknown User</b>
		</a>
	</section>
</div>
<section part="error" hidden="">
	<b>Error:</b>
	<span part="error-message"></span>
</section>`;
