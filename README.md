# react-datocms

![MIT](https://img.shields.io/npm/l/react-datocms?style=for-the-badge) ![MIT](https://img.shields.io/npm/v/react-datocms?style=for-the-badge) [![Build Status](https://img.shields.io/travis/datocms/react-datocms?style=for-the-badge)](https://travis-ci.org/datocms/react-datocms)

A set of components and utilities to work faster with [DatoCMS](https://www.datocms.com/) in React environments. Integrates seamlessy with DatoCMS's [GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api) and [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api).

<br /><br />
<a href="https://www.datocms.com/">
<img src="https://www.datocms.com/images/full_logo.svg" height="60">
</a>
<br /><br />

# Installation

```
npm install react-datocms
```

# Documentation

This package offers different components and hooks. Please refer to one of the following pages to learn more about a specific area of interest:

* [`<Image />` component for responsive/progressive images](./docs/image.md)
* [`<StructuredText />` component](./docs/structured-text.md)
* [`useQuerySubscription()` hook for live, real-time updates of content](./docs/live-real-time-updates.md)
* [`useSiteSearch()` hook to render a DatoCMS Site Search form widget](./docs/site-search.md)
* [`renderMetaTags()` and other helpers to render social share, SEO and Favicon meta tags](./docs/meta-tags.md)

# Demos

For fully working examples take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

Live demo: [https://react-datocms-example.netlify.com/](https://react-datocms-example.netlify.com/)

# Development

This repository contains a number of demos/examples. You can use them to locally test your changes to the package with `npm link`:

```
npm link
cd examples/images-and-seo/vanilla-react
npm link react-datocms
npm run start
```

Now on another terminal you can run:

```
npm run watch
```

This will re-compile the package everytime you make a change, and the example project will pick those changes instantly.
