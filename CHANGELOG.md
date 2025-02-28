# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
