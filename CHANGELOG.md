# react-datocms

## 8.1.2

### Patch Changes

- abf5207: Move to `datocms-structured-text` 6.x, so you don't end up with two copies of it
  
  If your app already depends on `datocms-structured-text-utils` 6.x, you have been
  getting a second copy of it — a 5.x one — tucked under react-datocms, because we
  asked for `^5`. Two copies mean a bigger bundle and two versions of types that
  should be one. This release asks for `^6` instead, and the duplicate goes away.
  
  Nothing to do on your side, and nothing changes at runtime: 6.0.0 of these
  packages was a version bump and nothing else, so every type and helper
  react-datocms re-exports is exactly the one it re-exported before.

## [7.2.0] - 2025-02-28

### Added

- Support for inline blocks

## [2.0.1] - 2022-01-05

### Added

- `layout` property to Image component
### Changed

- Default layout is now `intrinsic`, so the image the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports

## [1.2.2] - 2020-05-07

### Fixed

- Support for IE11

## [1.2.1] - 2020-03-24

### Fixed

- Hide placeholder base64 when actual image is loaded

## [1.1.2] - 2020-03-18

### Added

- `explicitWidth` prop to specify wheter the image wrapper should explicitely declare the width of the image or keep it fluid

## [1.1.0] - 2020-03-06

### Added

- You can now specify `style` and `imgStyle` props;

### Fixed

- Added `max-width` rule to inner `<img>` element;

### Changed

- Changed the default `display` rule of the component to `inline-block` to better replicate the behaviour of the default `<img>` element;
