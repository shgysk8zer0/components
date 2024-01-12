# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.1.6] - 202-01-12

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
