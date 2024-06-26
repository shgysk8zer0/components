export default `<button part="close" type="button" title="Close">
	<slot name="close-icon">
		<svg width="17" height="22" viewBox="0 0 12 16" role="img" aria-hidden="true" fill="currentColor">
			<path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/>
		</svg>
	</slot>
</button>
<span part="url">
	<slot name="url"></slot>
</span>
<span part="icon">
	<slot name="icon">
		<svg width="56" height="64" viewBox="0 0 14 16" role="img" arria-hidden="true" fill="currentColor">
			<path fill-rule="evenodd" d="M13.99 11.991v1H0v-1l.73-.58c.769-.769.809-2.547 1.189-4.416.77-3.767 4.077-4.996 4.077-4.996 0-.55.45-1 .999-1 .55 0 1 .45 1 1 0 0 3.387 1.229 4.156 4.996.38 1.879.42 3.657 1.19 4.417l.659.58h-.01zM6.995 15.99c1.11 0 1.999-.89 1.999-1.999H4.996c0 1.11.89 1.999 1.999 1.999z"/>
		</svg>
	</slot>
</span>
<h4 part="title">
	<slot name="title"></slot>
</h4>
<span part="badge">
	<slot name="badge">
		<svg width="14" height="16" viewBox="0 0 14 16" role="img" arria-hidden="true" fill="currentColor">
			<path fill-rule="evenodd" d="M13.99 11.991v1H0v-1l.73-.58c.769-.769.809-2.547 1.189-4.416.77-3.767 4.077-4.996 4.077-4.996 0-.55.45-1 .999-1 .55 0 1 .45 1 1 0 0 3.387 1.229 4.156 4.996.38 1.879.42 3.657 1.19 4.417l.659.58h-.01zM6.995 15.99c1.11 0 1.999-.89 1.999-1.999H4.996c0 1.11.89 1.999 1.999 1.999z"/>
		</svg>
	</slot>
</span>
<p part="body">
	<slot name="body"></slot>
</p>
<div part="image">
	<slot name="image"></slot>
</div>
<div part="actions">
	<slot name="actions"></slot>
</div>
<slot name="data" hidden=""></slot>
<slot name="timestamp"></slot>`;
