export default `<div id="container">
	<header id="header" class="grid" part="header">
		<span id="icon" part="icon">
			<svg width="192" height="192" viewBox="0 0 12 16">
				<path fill-rule="evenodd" fill="currentColor" d="M6 5h2v2H6V5zm6-.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v11l3-5 2 4 2-2 3 3V5z"/>
			</svg>
		</span>
		<h2 id="title" class="no-margin">
			<span part="name">Unknown App</span>
		</h2>
		<span id="install">
			<button type="button" class="btn header-btn install-btn" title="Install as Web App" part="button install-button" data-click="install" disabled="">
				<slot name="install-icon">
					<svg class="current-color" height="20" width="20" viewBox="0 0 16 16">
						<path d="M3 8h10v7.059c0 .492-.472.937-.996.937H4c-.539 0-1-.43-1-1z" overflow="visible"/>
						<path d="M6.688 2.969a1 1 0 0 0-.657.375L3.22 6.812a1 1 0 0 0-.22.625v1a1 1 0 1 0 2 0v-.656l2.594-3.156a1 1 0 0 0-.907-1.656zm2.218 3a1 1 0 1 0-.031 2l2.156.375V8.5a1 1 0 1 0 2 0v-1a1 1 0 0 0-.812-1l-3-.5a1 1 0 0 0-.313-.031z" overflow="visible"/>
					</svg>
				</slot>
				<span>Install</span>
			</button>
		</span>
		<div id="store-banners" part="banner">
			<div id="platforms-container">
				<button data-platform="webapp" part="store-badge pwa-badge" data-click="install" title="Install as Web App" disabled="" hidden="">
					<slot name="pwa-badge">
						<img src="https://cdn.kernvalley.us/img/logos/pwa-badge.svg" height="53" width="180" loading="lazy" decoding="async" crossorigin="anonymous" referrerpolicy="no-referrer" alt="Install Web App" />
					</slot>
				</button>
				<a href="https://play.google.com/store/apps/details?id=" data-platform="play" part="store-badge play-badge" class="inline-block" title="Get it on Google Play" target="_blank" rel="norefferer noopener external" hidden="">
					<slot name="play-badge">
						<img src="https://cdn.kernvalley.us/img/logos/play-badge.svg" height="53" width="180" loading="lazy" decoding="async" crossorigin="anonymous" referrerpolicy="no-referrer" alt="Google Play Store" />
					</slot>
				</a>
				<a href="https://itunes.apple.com/app/" data-platform="itunes" part="store-badge itunes-badge" class="inline-block" title="Get it on the App Store" target="_blank" rel="norefferer noopener external" hidden="">
					<slot name="itunes-badge">
						<img src="https://cdn.kernvalley.us/img/logos/itunes-badge.svg" height="53" width="158" loading="lazy" decoding="async" crossorigin="anonymous" referrerpolicy="no-referrer" alt="App Store" />
					</slot>
				</a>
				<a href="https://www.microsoft.com/store/apps/" data-platform="windows" part="store-badge windows-badge" class="inline-block" title="Get it on the Microsoft Store" target="_blank" rel="norefferer noopener external" hidden="">
					<slot name="windows-badge">
						<img src="https://cdn.kernvalley.us/img/logos/windows-badge.svg" height="53" width="147" loading="lazy" decoding="async" crossorigin="anonymous" referrerpolicy="no-referrer" alt="Microsoft Store" />
					</slot>
				</a>
				<a href="https://www.amazon.com/gp/product/" data-platform="amazon" part="store-badge amazon-badge" class="inline-block" title="Get it on the Microsoft Store" target="_blank" rel="norefferer noopener external" hidden="">
					<slot name="amazon-badge">
						<img src="https://cdn.kernvalley.us/img/logos/amazon-appstore-badge.svg" height="53" width="147" loading="lazy" decoding="async" crossorigin="anonymous" referrerpolicy="no-referrer" alt="Amazon Appstore" />
					</slot>
				</a>
				<a href="https://f-droid.org/" data-platform="f-droid" part="store-badge f-droid-badge" class="inline-block" title="Get it on F-Droid" target="_blank" rel="norefferer noopener external" hidden="">
					<slot name="f-droid-badge">
						<img src="https://cdn.kernvalley.us/img/logos/f-droid-badge.svg" height="53" width="147" loading="lazy" decoding="async" crossorigin="anonymous" referrerpolicy="no-referrer" alt="F-Droid" />
					</slot>
				</a>
			</div>
			<hr />
		</div>
		<div id="details" part="details">
			<slot name="details">
				This app can be installed on your PC or mobile device. This will allow this web app to look and behave like any other installed app. You will find it in your app lists and be able to pin it to your home screen, start menus or task bars. This installed web app will also be able to safely interact with other apps and your operating system.
			</slot>
		</div>
		<button id="close-btn-icon" type="button" class="bo-border no-background color-inherit" title="Close install prompt" part="x-button" data-click="close">
			<svg class="icon" fill="currentColor" height="20" width="20" viewBox="0 0 12 16">
				<path fill-rule="evenodd" fill="currentColor" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/>
			</svg>
		</button>
	</header>
	<section part="body">
		<div id="details-container">
			<div class="features">
				<h4 id="features-header" class="no-margin" part="features-header">
					<slot name="features-heading">Key Features</slot>
				</h4>
				<ul part="features">
					<li>When installed, it will be available and display just like a native app</li>
					<li>Certain content may be available even when on slow networks or offline</li>
				</ul>
			</div>
			<div part="screenshots"></div>
		</div>
		<br class="clearfix" />
		<div part="description-container">
			<h4 id="description-header" class="no-margin" part="description-header">
				<slot name="description-heading">Description</slot>
			</h4>
			<div id="description" part="description">No description available</div>
		</div>
	</section>
	<section>
		<h4>Application Categories</h4>
		<ul id="categories" part="categories"></ul>
	</section>
	<footer id="footer" class="clearfix">
		<button type="button" id="cancel-btn" class="btn footer-btn footer-cancel-btn" title="Close install prompt" part="button cancel-button" data-click="close">
			<slot name="cancel-icon">
				<svg class="icon" fill="curerntColor" height="20" width="20" viewBox="0 0 12 16">
					<path fill-rule="evenodd" fill="currentColor" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/>
				</svg>
			</slot>
			<span>Cancel</span>
		</button>
	</footer>
</div>`;
