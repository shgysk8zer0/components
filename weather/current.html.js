import { html } from '@aegisjsproject/parsers/html.js';

export default html`<div id="wrapper" class="grid">
	<h3 class="center" part="city" id="city">
		<span>Weather in</span>
		<slot name="city">Unknown</slot>
	</h3>
	<div id="icon" class="center no-overflow">
		<slot name="icon">
			<svg class="current-color" viewBox="0 0 16 16" fill="currentColor">
				<use xlink:href="#sunny"></use>
			</svg>
		</slot>
	</div>
	<div part="temp" id="temp">
		<slot name="temp">No data</slot>&deg;<slot name="tempUnits">F</slot>
	</div>
	<b class="capitalize" id="conditions"><slot name="conditions">Unknown</slot></b>
	<div part="wind" id="wind">
		<div>
			<span>Wind:</span>
			<slot name="windSpeed">?</slot>
			<slot name="speedUnits"><abbr title="Miles Per Hour">mph</abbr></slot>
		</div>
	</div>
	<div part="updated" id="updated">
		<b>Updated:</b>
		<slot name="updated"></slot>
	</div>
	<div part="credits" id="credits">
		<span>Weather data provided by</span>
		<a href="https://openweathermap.org" rel="noopener extnernal" class="color-inherit">OpenWeatherMap</a>
	</div>
</div>
		<svg xmlns="http://www.w3.org/2000/svg" hidden="">
<symbol id="weather-clear" viewBox="0 0 16 16">
	<path d="M7.996 2.994C5.246 2.994 2.989 5.25 2.989 8c0 2.75 2.257 5.006 5.007 5.006 2.75 0 5.006-2.256 5.006-5.006 0-2.75-2.257-5.006-5.006-5.006zM14 7c.138.713.112 1.37 0 2l2-1zM2 7a5.387 5.387 0 0 0 0 2L0 8zm7 7a5.387 5.387 0 0 1-2 0l1 2zM9 2a5.387 5.387 0 0 0-2 0l1-2zM4.465 12.95a5.387 5.387 0 0 1-1.415-1.414l-.707 2.12zm8.485-8.486a5.387 5.387 0 0 0-1.414-1.414l2.121-.707zm-9.9 0A5.387 5.387 0 0 1 4.465 3.05l-2.122-.707zm8.486 8.486a5.387 5.387 0 0 0 1.414-1.414l.707 2.12z" overflow="visible"/>

</symbol>
<symbol id="weather-clear-night" viewBox="0 0 16 16">
	<path d="M6.815 1.107C3.519 1.672.992 4.548.992 8c0 3.854 3.148 7 7.002 7a6.96 6.96 0 0 0 4.58-1.723C8.8 12.295 5.992 8.86 5.992 4.785a8.69 8.69 0 0 1 .823-3.678z" overflow="visible"/>
	<path d="M7.994 1c-.402 0-.795.042-1.18.107a8.69 8.69 0 0 0-.822 3.678c0 4.075 2.807 7.51 6.582 8.492A6.983 6.983 0 0 0 14.994 8c0-3.854-3.146-7-7-7z" opacity=".35" overflow="visible"/>

</symbol>
<symbol id="weather-few-clouds" viewBox="0 0 16 16">
	<path d="M8 3C5.25 3 3 5.25 3 8c0 1.783.958 3.363 2.375 4.25a3.4 3.4 0 0 1 .531-.188c.229-1.816 1.72-3.25 3.594-3.25 1.003 0 1.839.474 2.5 1.126.175-.034.308-.126.5-.126h.125C12.849 9.246 13 8.643 13 8c0-2.75-2.25-5-5-5z" overflow="visible"/>
	<path d="M9.5 10A2.5 2.5 0 0 0 7 12.5c0 .218.041.423.094.625A1.549 1.549 0 0 0 6.5 13a1.5 1.5 0 1 0 0 3h8a1.5 1.5 0 1 0 0-3 2 2 0 0 0-2-2c-.316 0-.61.088-.875.219A2.47 2.47 0 0 0 9.5 10zM14 7c.138.713.112 1.37 0 2l2-1zM2 7a5.387 5.387 0 0 0 0 2L0 8zm7-5a5.387 5.387 0 0 0-2 0l1-2zM4.465 12.95a5.387 5.387 0 0 1-1.415-1.414l-.707 2.12zm8.485-8.486a5.387 5.387 0 0 0-1.414-1.414l2.121-.707zm-9.9 0A5.387 5.387 0 0 1 4.465 3.05l-2.122-.707z" overflow="visible"/>

</symbol>
<symbol id="weather-few-clouds-night" viewBox="0 0 16 16">
	<path d="M9.5 10A2.5 2.5 0 0 0 7 12.5c0 .218.041.423.094.625A1.549 1.549 0 0 0 6.5 13a1.5 1.5 0 1 0 0 3h8a1.5 1.5 0 1 0 0-3 2 2 0 0 0-2-2c-.316 0-.61.088-.875.219A2.47 2.47 0 0 0 9.5 10zM6.82 1.107C3.526 1.672.999 4.548.999 8c0 2.33 1.155 4.394 2.916 5.668.311-.813 1.064-1.394 1.942-1.639A3.806 3.806 0 0 1 7.37 9.475a8.69 8.69 0 0 1-1.373-4.69c0-1.314.3-2.556.823-3.678z" overflow="visible"/>
	<path d="M8 1c-.402 0-.795.042-1.18.107a8.69 8.69 0 0 0-.822 3.678 8.69 8.69 0 0 0 1.373 4.69 3.567 3.567 0 0 1 2.13-.715c.997 0 1.82.484 2.486 1.125.18-.035.315-.125.513-.125.775 0 1.474.288 2.02.756.305-.782.48-1.628.48-2.516 0-3.854-3.146-7-7-7z" opacity=".35" overflow="visible"/>

</symbol>
<symbol id="weather-fog" viewBox="0 0 16 16">
	<path d="M3.313 1c-.624 0-1.009.33-1.282.594-.273.264-.463.531-.656.781s-.386.483-.5.594C.761 3.079.763 3 1 3a1 1 0 1 0 0 2c.623 0 1.008-.33 1.281-.594.273-.264.463-.562.656-.812.142-.184.27-.286.376-.407.106.12.233.223.374.407.194.25.415.547.688.812.273.265.627.594 1.25.594s1.008-.33 1.281-.594c.273-.264.494-.562.688-.812.147-.19.236-.317.343-.438.11.121.223.24.375.438.194.25.415.547.688.812.273.265.658.594 1.281.594.624 0 1.009-.33 1.281-.594.273-.264.463-.562.657-.812.142-.184.269-.286.375-.407.106.12.233.223.375.407.193.25.383.547.656.812S14.283 5 14.906 5a1 1 0 1 0 .063-2c.02.008.123.027.062-.031a6.726 6.726 0 0 1-.5-.594c-.193-.25-.383-.516-.656-.781S13.217 1 12.594 1c-.624 0-1.009.33-1.281.594-.273.264-.463.531-.657.781-.15.193-.266.348-.375.469-.11-.122-.221-.27-.375-.469a7.216 7.216 0 0 0-.687-.781C8.946 1.329 8.592 1 7.969 1c-.624 0-1.009.33-1.282.594A7.208 7.208 0 0 0 6 2.375c-.153.198-.265.348-.375.469-.108-.121-.195-.277-.344-.469a7.216 7.216 0 0 0-.687-.781C4.32 1.329 3.936 1 3.312 1zm0 5c-.624 0-1.009.33-1.282.594-.273.264-.463.531-.656.781s-.386.483-.5.594c-.114.11-.112.03.125.03A1 1 0 1 0 1 10c.623 0 1.008-.33 1.281-.594.273-.264.463-.562.656-.812.142-.184.27-.286.376-.407.106.12.233.223.374.407.194.25.415.547.688.812.273.265.627.594 1.25.594s1.008-.33 1.281-.594c.273-.264.494-.562.688-.812.147-.19.236-.317.343-.438.11.121.223.24.375.438.194.25.415.547.688.812.273.265.658.594 1.281.594.624 0 1.009-.33 1.281-.594.273-.264.463-.562.657-.812.142-.184.269-.286.375-.407.106.12.233.223.375.407.193.25.383.547.656.812s.658.594 1.281.594a1 1 0 1 0 .063-2c.02.008.123.027.062-.031a6.725 6.725 0 0 1-.5-.594c-.193-.25-.383-.516-.656-.781S13.217 6 12.594 6c-.624 0-1.009.33-1.281.594-.273.264-.463.531-.657.781-.15.193-.266.348-.375.469-.11-.122-.221-.27-.375-.469a7.216 7.216 0 0 0-.687-.781C8.946 6.329 8.592 6 7.969 6c-.624 0-1.009.33-1.282.594A7.209 7.209 0 0 0 6 7.375c-.153.198-.265.348-.375.469-.108-.121-.195-.277-.344-.469a7.215 7.215 0 0 0-.687-.781C4.32 6.329 3.936 6 3.312 6zm0 5c-.624 0-1.009.33-1.282.594-.273.264-.463.531-.656.781s-.386.483-.5.594C.761 13.079.763 13 1 13a1 1 0 1 0 0 2c.623 0 1.008-.33 1.281-.594.273-.264.463-.562.656-.812.142-.184.27-.286.376-.407.106.12.233.223.374.407.194.25.415.547.688.812.273.265.627.594 1.25.594s1.008-.33 1.281-.594c.273-.264.494-.562.688-.812.147-.19.236-.317.343-.438.11.121.223.24.375.438.194.25.415.547.688.812.273.265.658.594 1.281.594.624 0 1.009-.33 1.281-.594.273-.264.463-.562.657-.812.142-.184.269-.286.375-.407.106.12.231.252.375.438.193.25.383.516.656.781s.658.594 1.281.594a1 1 0 1 0 .063-2c.02.008.123.027.062-.031a6.726 6.726 0 0 1-.5-.594c-.193-.25-.383-.516-.656-.781S13.217 11 12.594 11c-.624 0-1.009.33-1.281.594-.273.264-.463.531-.657.781-.15.193-.266.348-.375.469-.11-.122-.221-.27-.375-.469a7.216 7.216 0 0 0-.687-.781c-.273-.265-.627-.594-1.25-.594-.624 0-1.009.33-1.282.594a7.208 7.208 0 0 0-.687.781c-.153.198-.265.348-.375.469-.108-.121-.195-.277-.344-.469a7.216 7.216 0 0 0-.687-.781C4.32 11.329 3.936 11 3.312 11z" opacity=".5" overflow="visible"/>

</symbol>
<symbol id="weather-overcast" viewBox="0 0 16 16">
	<path d="M9.5 4a2.49 2.49 0 0 0-2.469 2.219C6.704 6.097 6.37 6 6 6a3 3 0 0 0-3 3c0 .098.022.185.031.281A2.014 2.014 0 0 0 2 9a2 2 0 1 0 0 4h12.5a1.5 1.5 0 1 0 0-3c-.207 0-.414.05-.594.125A2.44 2.44 0 0 0 14 9.5c0-1.23-.893-2.228-2.063-2.438A2.5 2.5 0 0 0 9.5 4z" overflow="visible"/>

</symbol>
<symbol id="weather-severe-alert" viewBox="0 0 16 16">
	<path d="M9.5 2a2.49 2.49 0 0 0-2.469 2.219C6.704 4.097 6.37 4 6 4a3 3 0 0 0-3 3c0 .098.022.185.031.281A2.014 2.014 0 0 0 2 7a2 2 0 1 0 0 4h5V8.875C7 7.865 7.865 7 8.875 7h5.062a2.499 2.499 0 0 0-2-1.938A2.5 2.5 0 0 0 9.5 2z" overflow="visible"/>
	<path d="M8.875 8A.863.863 0 0 0 8 8.875v6.25c0 .492.383.875.875.875h6.25a.863.863 0 0 0 .875-.875v-6.25A.863.863 0 0 0 15.125 8h-6.25zM11 9h2v4h-2V9zm0 5h2v1h-2v-1z" overflow="visible"/>

</symbol>
<symbol id="weather-showers" viewBox="0 0 16 16">
	<path d="M9.465 0C8.192 0 7.158.973 7.017 2.219 6.693 2.097 6.361 2 5.994 2 4.351 2 3.02 3.343 3.02 5c0 .098.022.185.031.281A1.983 1.983 0 0 0 2.028 5 1.992 1.992 0 0 0 .044 7c0 1.105.888 2 1.984 2h12.396c.821 0 1.487-.672 1.487-1.5S15.245 6 14.424 6c-.206 0-.411.05-.589.125.052-.202.093-.407.093-.625 0-1.23-.886-2.228-2.045-2.438.041-.18.062-.368.062-.562 0-1.38-1.11-2.5-2.48-2.5zM2.406 10a.496.496 0 0 0-.406.406l-1 4.906a.496.496 0 1 0 .969.188l1-4.906A.496.496 0 0 0 2.406 10zm2 0a.496.496 0 0 0-.406.406l-1 4.906a.496.496 0 1 0 .969.188L5 10.594A.496.496 0 0 0 4.406 10zm2 0a.496.496 0 0 0-.406.406l-1 4.906a.509.509 0 1 0 1 .188l1-4.906A.496.496 0 0 0 6.406 10zm2 0a.496.496 0 0 0-.406.406l-1 4.906a.509.509 0 1 0 1 .188l1-4.906A.496.496 0 0 0 8.406 10zm2 0a.496.496 0 0 0-.375.406L9 15.312a.509.509 0 1 0 1 .188l1-4.906a.496.496 0 0 0-.594-.594zm2 0a.496.496 0 0 0-.375.406l-1 4.906A.496.496 0 1 0 12 15.5l1-4.906a.496.496 0 0 0-.594-.594z" overflow="visible"/>

</symbol>
<symbol id="weather-showers-scatterd" viewBox="0 0 16 16">
	<path d="M9.492 1c-1.277 0-2.314.973-2.455 2.219C6.712 3.097 6.378 3 6.01 3a2.992 2.992 0 0 0-2.983 3c0 .098.022.185.03.281A1.992 1.992 0 0 0 .045 8c0 1.105.89 2 1.99 2h.372a3.37 3.37 0 0 1 .653-.969l2.455-2.469 2.455 2.47c.283.284.464.62.621.968h.467l1.43-1.438L11.915 10h2.548c.824 0 1.492-.672 1.492-1.5S15.288 7 14.464 7c-.206 0-.412.05-.59.125.052-.202.093-.407.093-.625 0-1.23-.889-2.228-2.051-2.438a2.5 2.5 0 0 0 .062-.562c0-1.38-1.113-2.5-2.486-2.5z" overflow="visible"/>
	<path d="M5.5 7.906l-.344.375L3.72 9.687a2.502 2.502 0 0 0 0 3.532 2.54 2.54 0 0 0 3.562 0 2.502 2.502 0 0 0 0-3.531L5.844 8.28 5.5 7.906zm0 1.407l1.063 1.093c.59.59.59 1.535 0 2.125-.59.59-1.536.59-2.125 0V12.5c-.568-.591-.583-1.511 0-2.094L5.5 9.313zm5 .593l-.344.375-1.437 1.406a2.502 2.502 0 0 0 0 3.532 2.54 2.54 0 0 0 3.562 0 2.502 2.502 0 0 0 0-3.531l-1.437-1.407-.344-.375zm0 1.406l1.063 1.094c.59.59.59 1.535 0 2.125-.59.59-1.536.59-2.126 0V14.5c-.567-.591-.582-1.511 0-2.094l1.063-1.093z" overflow="visible"/>

</symbol>
<symbol id="weather-snow" viewBox="0 0 16 16">
	<path d="M9.536 0C8.259 0 7.222.973 7.081 2.219 6.756 2.097 6.423 2 6.055 2a2.992 2.992 0 0 0-2.983 3c0 .098.022.185.031.281A1.992 1.992 0 0 0 .089 7c0 1.105.89 2 1.989 2h1.025a1.492 1.5 0 0 1 1.803-1.906 1.492 1.5 0 0 1 .03 0 1.492 1.5 0 0 1 1.337-.438 1.492 1.5 0 0 1 .839-.593A1.492 1.5 0 0 1 8.51 4.968a1.492 1.5 0 0 1 1.461 1.093 1.492 1.5 0 0 1 .84.594 1.492 1.5 0 0 1 1.398.407A1.492 1.5 0 0 1 13.979 9h.53c.823 0 1.49-.672 1.49-1.5S15.333 6 14.51 6c-.207 0-.413.05-.591.125.052-.202.093-.407.093-.625 0-1.23-.888-2.228-2.051-2.438a2.5 2.5 0 0 0 .062-.562c0-1.38-1.113-2.5-2.486-2.5z" overflow="visible"/>
	<path d="M8.438 5.938a.5.5 0 0 0-.438.53v.657L7.719 7a.503.503 0 1 0-.438.906L8 8.25v1.813L6.344 9.03l.062-.875a.502.502 0 1 0-1-.093l-.03.406-.595-.375a.5.5 0 1 0-.531.844l.656.406-.312.25a.503.503 0 1 0 .594.812l.656-.5 1.687 1.032L5.813 12l-.657-.469a.5.5 0 1 0-.593.782l.343.25-.687.406a.512.512 0 1 0 .531.875l.625-.375.031.375a.501.501 0 1 0 1-.063l-.062-.906L8 11.844v1.812L7.281 14a.503.503 0 1 0 .438.906L8 14.781v.688a.5.5 0 1 0 1 0v-.688l.281.125A.503.503 0 1 0 9.72 14L9 13.656v-1.812l1.656 1-.062.937a.5.5 0 1 0 1 .031l.031-.375.594.375a.5.5 0 1 0 .531-.843l-.688-.407.344-.25a.503.503 0 1 0-.594-.812l-.656.5-1.687-1.031 1.687-1.031.688.468a.5.5 0 1 0 .562-.812l-.312-.219.687-.438a.512.512 0 1 0-.531-.874l-.625.374-.031-.374a.501.501 0 1 0-1 .062l.062.906L9 10.062V8.25l.719-.344A.503.503 0 1 0 9.28 7L9 7.125v-.656a.5.5 0 0 0-.563-.532z" overflow="visible"/>

</symbol>
<symbol id="weather-storm" viewBox="0 0 16 16">
	<path d="M9.51.044c-1.273 0-2.307.973-2.448 2.218-.324-.122-.657-.218-1.023-.218-1.643 0-2.975 1.343-2.975 3 0 .098.022.186.031.281a1.982 1.982 0 0 0-1.022-.281 1.992 1.992 0 0 0-1.984 2C.09 8.15.905 9 2 9h5V7.5c-.016-.786.74-1.47 1.518-1.487.8-.017 1.499.68 1.482 1.487V9h4.5c.822 0 1.455-.627 1.455-1.456 0-.828-.666-1.5-1.487-1.5-.206 0-.411.05-.59.125a2.44 2.44 0 0 0 .094-.625c0-1.23-.886-2.228-2.046-2.438.042-.181.062-.368.062-.562a2.49 2.49 0 0 0-2.479-2.5z" overflow="visible"/>
	<path d="M8.406 7A.5.5 0 0 0 8 7.5V10H5v1H3.281l-.125.156-2.5 2.5a.5.5 0 1 0 .688.688L3.687 12H5v3a.5.5 0 0 0 1 0v-3.375a.5.5 0 0 0 0-.219V11h2v.719l.156.125L10 13.688V15a.5.5 0 0 0 1 0v-1h1.344l2.406 1.438a.504.504 0 1 0 .5-.876l-2.5-1.5-.125-.062h-1.938L9 11.312v-.687a.5.5 0 0 0 0-.219V7.5a.5.5 0 0 0-.594-.5z" overflow="visible"/>

</symbol>
<symbol id="weather-windy" viewBox="0 0 16.022 16.009">
	<g white-space="normal">
		<path d="M8.053.111a3.496 3.496 0 0 0-1.99.073A1 1 0 1 0 6.7 2.078a1.493 1.493 0 0 1 1.584.408 1.5 1.5 0 0 1 .27 1.617c-.239.548-.77.9-1.366.903a1 1 0 1 0 .012 2 3.506 3.506 0 0 0 3.188-2.104 3.51 3.51 0 0 0-.63-3.767A3.493 3.493 0 0 0 8.054.11z" overflow="visible"/>
		<path fill-rule="evenodd" d="M0 5.006v2h7.38v-2z" overflow="visible"/>
		<path d="M13.904 4.125a2.842 2.842 0 0 0-1.666.014 1 1 0 1 0 .608 1.906c.335-.107.684-.01.931.283.248.292.314.732.157 1.1-.158.367-.48.574-.827.576a1 1 0 1 0 .012 2c1.158-.007 2.196-.724 2.652-1.787a3.058 3.058 0 0 0-.468-3.182 2.909 2.909 0 0 0-1.399-.91z" overflow="visible"/>
		<path fill-rule="evenodd" d="M7 8.006v2h6v-2z" overflow="visible"/>
		<path d="M9.465 16a2.498 2.498 0 0 1-1.47-.324.991.991 0 1 1 .991-1.717.513.513 0 0 0 .596-.053.52.52 0 0 0 .156-.582.516.516 0 0 0-.49-.346.991.991 0 1 1 0-1.982c1.05 0 1.995.663 2.354 1.65.358.987.06 2.102-.745 2.778-.402.338-.89.532-1.392.576z" overflow="visible"/>
		<path fill-rule="evenodd" d="M1 11.002v2h8.375v-2z" overflow="visible"/>
	</g>

</symbol></svg>`;
