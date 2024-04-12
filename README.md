# components
A collection of custom elements / web components

[![CodeQL](https://github.com/shgysk8zer0/components/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/shgysk8zer0/components/actions/workflows/codeql-analysis.yml)
![Node CI](https://github.com/shgysk8zer0/components/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://github.com/shgysk8zer0/components/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/shgysk8zer0/components.svg)](https://github.com/shgysk8zer0/components/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/shgysk8zer0/components.svg)](https://github.com/shgysk8zer0/components/commits/master)
[![GitHub release](https://img.shields.io/github/release/shgysk8zer0/components?logo=github)](https://github.com/shgysk8zer0/components/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@shgysk8zer0/components)](https://www.npmjs.com/package/@shgysk8zer0/components)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40shgysk8zer0%2Fcomponents)
[![npm](https://img.shields.io/npm/dw/@shgysk8zer0/components?logo=npm)](https://www.npmjs.com/package/@shgysk8zer0/components)

[![GitHub followers](https://img.shields.io/github/followers/shgysk8zer0.svg?style=social)](https://github.com/shgysk8zer0)
![GitHub forks](https://img.shields.io/github/forks/shgysk8zer0/components.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/shgysk8zer0/components.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")
- - -

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Contributing](./.github/CONTRIBUTING.md)
<!-- - [Security Policy](./.github/SECURITY.md) -->


Requires [`@shgysk8zer0/polyfills`](https://npmjs.org/package/@shgysk8zer0/polyfills)
and [`@shgysk8zer0/kazoo`](https://npmjs.org/package/@shgysk8zer0/kazoo), at least
via import map (use [`@shgysk8zer0/rollup-import`](https://npmjs.org/package/@shgysk8zer0/rollup-import)).
These are not included as dependencies, as it is not intended for use via `npm i`.

These components require modern & even experimental JS features, and the polyfills
are not included here. You may need `@shgysk8zer0/polyfills/elementInternals`,
`@shgysk8zer0/polyfills/sanitizer.js`and `@shgysk8zer0/trustedTypes.js`
at minimum (as of 5/2023). To be on the safe side, just `import '@shghsk8zer0/polyfills'`.

## Example import map

```html
<script type="importmap">
{
  "imports": {
    "@shgysk8zer0/kazoo/": "https://unpkg.com/@shgysk8zer0/kazoo@1.0.3/",
    "@shgysk8zer0/konami": "https://unpkg.com/@shgysk8zer0/konami@1.1.1/konami.js",
    "@shgysk8zer0/polyfills": "https://unpkg.com/@shgysk8zer0/polyfills@0.3.10/all.min.js",
    "@shgysk8zer0/polyfills/": "https://unpkg.com/@shgysk8zer0/polyfills@0.3.10/",
    "@shgysk8zer0/jswaggersheets": "https://unpkg.com/@shgysk8zer0/jswaggersheets@1.1.0/swagger.js",
    "@shgysk8zer0/jswaggersheets/": "https://unpkg.com/@shgysk8zer0/jswaggersheets@1.1.0/",
    "@shgysk8zer0/jss/": "https://unpkg.com/@shgysk8zer0/jss@1.0.1/",
    "@shgysk8zer0/consts/": "https://unpkg.com/@shgysk8zer0/consts@1.0.8/",
    "@shgysk8zer0/http/": "https://unpkg.com/@shgysk8zer0/http@1.0.5/",
    "@shgysk8zer0/http-status": "https://unpkg.com/@shgysk8zer0/http-status@1.1.1/http-status.js",
    "@aegisjsproject/trusted-types": "https://unpkg.com/@aegisjsproject/trusted-types@1.0.1/bundle.min.js",
    "@aegisjsproject/trusted-types/": "https://unpkg.com/@aegisjsproject/trusted-types@1.0.1/",
    "@aegisjsproject/parsers": "https://unpkg.com/@aegisjsproject/parsers@0.0.8/bundle.min.js",
    "@aegisjsproject/parsers/": "https://unpkg.com/@aegisjsproject/parsers@0.0.8/",
    "@aegisjsproject/sanitizer": "https://unpkg.com/@aegisjsproject/sanitizer@0.1.0/sanitizer.js",
    "@aegisjsproject/sanitizer/": "https://unpkg.com/@aegisjsproject/sanitizer@0.1.0/",
    "@aegisjsproject/core": "https://unpkg.com/@aegisjsproject/core@0.2.13/core.js",
    "@aegisjsproject/core/": "https://unpkg.com/@aegisjsproject/core@0.2.13/",
    "@aegisjsproject/styles": "https://unpkg.com/@aegisjsproject/styles@0.1.1/styles.js",
    "@aegisjsproject/styles/": "https://unpkg.com/@aegisjsproject/styles@0.1.1/",
    "@aegisjsproject/component": "https://unpkg.com/@aegisjsproject/component@0.1.2/component.js",
    "@aegisjsproject/component/": "https://unpkg.com/@aegisjsproject/component@0.1.2/",
    "@aegisjsproject/markdown": "https://unpkg.com/@aegisjsproject/markdown@0.1.2/markdown.js",
    "@aegisjsproject/markdown/": "https://unpkg.com/@aegisjsproject/markdown@0.1.2/",
    "@aegisjsproject/aegis-md": "https://unpkg.com/@aegisjsproject/aegis-md@0.0.2/aegis-md.js",
    "@aegisjsproject/aegis-md/": "https://unpkg.com/@aegisjsproject/aegis-md@0.0.2/",
    "@shgysk8zer0/components/": "https://unpkg.com/@shgysk8zer0/components@0.2.5/",
    "@kernvalley/components/": "https://unpkg.com/@kernvalley/components@1.1.5/",
    "@webcomponents/custom-elements": "https://unpkg.com/@webcomponents/custom-elements@1.6.0/custom-elements.min.js",
    "leaflet": "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js",
    "urlpattern-polyfill": "https://unpkg.com/urlpattern-polyfill@10.0.0/index.js",
    "highlight.js": "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/es/core.min.js",
    "highlight.js/": "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/es/",
    "@highlightjs/cdn-assets": "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/es/core.min.js",
    "@highlightjs/cdn-assets/": "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/es/",
    "marked": "https://unpkg.com/marked@12.0.1/lib/marked.esm.js",
    "marked-highlight": "https://unpkg.com/marked-highlight@2.1.1/src/index.js",
    "firebase/": "https://www.gstatic.com/firebasejs/9.23.0/"
    }
}
</script>
```
