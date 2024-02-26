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
    "@shgysk8zer0/kazoo/": "https://unpkg.com/@shgysk8zer0/kazoo@0.0.9/",
    "@shgysk8zer0/polyfills": "https://unpkg.com/@shgysk8zer0/polyfills@0.0.5/all.min.js",
    "@shgysk8zer0/polyfills/": "https://unpkg.com/@shgysk8zer0/polyfills@0.0.5/",
    "@shgysk8zer0/konami": "https://unpkg.com/@shgysk8zer0/konami@1.0.9/konami.js",
    "@shgysk8zer0/components/": "https://unpkg.com/@shgysk8zer0/components/",
    "@kernvalley/components/": "https://unpkg.com/@shgysk8zer0/components/krv/",
    "leaflet": "https://unpkg.com/leaflet@1.9.3/dist/leaflet-src.esm.js"
  }
}
</script>
```
