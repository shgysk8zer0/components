# components
A collection of custom elements / web components

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
    "@shgysk8zer0/kazoo/": "https://unpkg.com/@shgysk8zer0/kazoo@0.0.7/",
    "@shgysk8zer0/polyfills": "https://unpkg.com/@shgysk8zer0/polyfills@0.0.5/all.min.js",
    "@shgysk8zer0/polyfills/": "https://unpkg.com/@shgysk8zer0/polyfills@0.0.5/",
    "@shgysk8zer0/konami": "https://unpkg.com/@shgysk8zer0/konami@1.0.9/konami.js",
    "@shgysk8zer0/components/": "../"
  }
}
</script>
```
