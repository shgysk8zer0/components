# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.2.16] - 2024-06-18

### Changed
- Pass scaling factors around based on single attribute read

###  Fixed
- Do not trigger redundant rendering

## [v0.2.15] - 2024-06-17

### Added
- Add scaling & different resolution support for `<photo-boooth>`
- Add `HTMLPhotoBoothElement` static properties (consts) from resolutions & supported image types/mime-types

### Changed
- Text for `<photo-booth>` now splits font-family, size, and weight (for scaling purposes)

## [v0.2.14] - 2024-06-13

### Added
- Add support for delay in `<photo-booth>`
- Add wake/screen lock when `<photo-booth>` is active/on
- Add static methods to create `<photo-booth>` from an object or fetching JSON

### Changed
- Refactor template for `<photo-booth>` to be just one template rather than multiple
- Move settings button to controls panel in `<photo-booth>`

## [v0.2.13] - 2024-06-11

### Added
- Added support for mirroring camera in `<photo-booth>`

### Fixed
- Fix camera options sizing in `<photo-booth>`

## [v0.2.12] - 2024-06-11

### Added
- Add support for SVG in `<photo-booth>`
- Add support for before/after capture events in `<photo-booth>`

### Changed
- `<photo-booth>` media info now contains optional media queries

## [v0.2.11] - 2024-06-10

### Added
- Add support for "overlay"s (filled rects) in `<photo-booth>`

## [v0.2.10] - 2024-06-10

### Added
- Support creating media (images & text) with media queries in `<photo-booth>`
- Cache media info for `<photo-booth>` (do not query & parse on every frame)

## [v0.2.9] - 2024-06-9

### Added
- Add support for media queries for `<photo-booth>`

### Changed
- Do not exit fullscreen when changing camera in `<photo-booth>`

## [v0.2.8] - 2024-06-08

### Added
- Multiple enhancements to `<photo-booth>`

## [v0.2.7] - 2024-06-07

### Added
- Create `<photo-booth>` component

## [v0.2.6] - 2024-04-16

### Fixed
- Fix typo in creating styles for `<html-notification>`

## [v0.2.5] - 2024-04-12

### Added
- Add special styles for `<spotify-player popover="...">`
- Add tests for `<window-controls>` with page search by id

### Changed
- Update importmap example in README

### Fixed
- Fix setting styles for `<window-controls>`

## [v0.2.4] - 2024-04-11

### Changed
- Component templates & styles are now treated as strings and parsed lazily

## [v0.2.3] - 2024-04-06

### Fixed
- Remove components that have been moved to `@kernvalley/components`

## [v0.2.2] - 2024-04-06

### Changed
- Finish (?) transition to using AegisJSProject

## [v0.2.1] - 2024-04-05

### Fixed
- Fix missing `window-controls.css` (empty now)

## [v0.2.0]] - 2024-04-05

### Changed
- Switch to using `@aegisjsproject/*` for Trusted Types & Sanitizer
- Numerous dependency updates
- Markdown component no longer loads anything but plaintext language for syntax highlighting by default
- Use `@aegisjsproject/parsers` for (mostly) all component templates and styles (no more additional requests)
- Now requires `aegis-sanitizer#html` for sanitizer polyfill

### Deprecated
- `*#html` Trusted Types Policies are deprecated and a warning is given upon successful creation
- `*html` & `*.css` resources are now just comments, kept to not break service workers

## [v0.1.6] - 2024-01-12

### Added
- Add `<google-calendar>`

### Changed
- Misc package updates
- Switch to using `youtube#script-url` instead of `youtube#embed` for TrustedTypesPolicy

## [v0.1.5] -  2023-10-31

### Added
- `<iframe>`-related modules now support `credentialless` where appropriate
- Use own importmap config file

### Changed
- Update Rollup config files

### Removed
- Remove unused Rollup config files

## [v0.1.4]  - 2023-09-08

### Fixed
- Invert the sign-in requirements of `<firebase-password-reset>` [#49](https://github.com/shgysk8zer0/components/issues/49)

## [v0.1.3] - 2023-09-07

### Added
- `<firebase-change-email>`
- `<firebase-verify-email>`
- `<firebase-change-password>`
- `<firebase-email-link>`

### Changed
- Misc. updates for better consistency and functionality
## [v0.1.2] - 2023-08-22

### Added
- `<firebase-sign-in>`
- `<firebase-sign-up>`
- `<firebase-password-reset>`
- `<firebase-confirm-reset>`

## [v0.1.1] - 2023-07-09

### Added
- Add peer dependencies
- Add funding

## [v0.1.0] - 20023-07-03

### Changed
- Update to node 20
- Update GH Action for npm publish
- Update npm scripts for versioning and locks

## [v0.0.14] - 2023-07-01

### Fixed
- Remove `*.min.*` and `*.map` from `.npmignore`

## [v0.0.13] - 2023-07-01

### Added
- Add `importmap.js`

### Changed
- Use `@shgysk8zer0/kazoo/markdown` in `<mark-down>`

### Removed
- Uninstall `@shgysk8zer0/importmap`

## [v0.0.12] - 2023-06-26

### Fixed
- Actually run `build` script

## [v0.0.11] - 2023-06-26

### Fixed
- Add missing `build:js:mark-down` script when packaging

## [v0.0.10] - 2023-06-26

### Added
- Create `<mark-down>` & `<github-md-file>` & `<github-readme>`
- Create `<reddit-posts>`
- Add `rollupImportMeta` plugin

### Changed
- Update GitHub Release Action
- Remove all `eslint`, `stylelint`, & `rollup` to use `@shgysk8zer0/js-utils` & `@shgysk8zer0/css-utils`
- Get name, version, & URL from `package.json` instead of `consts.js`
- Update importmap

## [v0.0.9] - 2023-05-16

### Added
- Re-add `<form is="share-target">`

## [v0.0.8] - 2023-05-15

### Fixed
- Fix path for `import.meta.js` in `<toast-message>`

## [v0.0.7] - 2023-05-15

### Fixed
- Use correct version in `consts.js`

## [v0.0.6] - 2023-05-15

### Fixed
- Include minified scripts when publishing

## [v0.0.5] - 2023-05-15

### Fixed
- Remove use of `create()` from `dom.js` & use `createElement()` from `elements.js`

## [v0.0.4] - 2023-05-15

### Added
- `<install-prompt>`
- `<stripe-payment-form>`
- `<disqus-comments>`
- `<not-supported>`

## [v0.0.3] - 2023-05-14

### Added
- `<button is="share-button">`
- `<toast-message>`

### Changed
- Update `importmap.json`

### [v0.0.2] - 2023-05-14

### Added
- Add `.github` directory with workflows, etc.
- Add CHANGELOG

### Changed
- Update README
