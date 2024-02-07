<!--datocms-autoinclude-header start-->
<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)
<!--datocms-autoinclude-header end-->

# react-datocms

![MIT](https://img.shields.io/npm/l/react-datocms?style=for-the-badge) ![MIT](https://img.shields.io/npm/v/react-datocms?style=for-the-badge) [![Build Status](https://img.shields.io/travis/datocms/react-datocms?style=for-the-badge)](https://travis-ci.org/datocms/react-datocms)

A set of components and utilities to work faster with [DatoCMS](https://www.datocms.com/) in React environments. Integrates seamlessy with DatoCMS's [GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api) and [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api).

# Installation

```
npm install react-datocms
```

# Documentation

This package offers different components and hooks. Please refer to one of the following pages to learn more about a specific area of interest:

* [`<Image />` component for responsive/progressive images](./docs/image.md)
* [`<StructuredText />` component](./docs/structured-text.md)
* [`<VideoPlayer />` component](./docs/video-player.md)
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

<!--datocms-autoinclude-footer start-->
-----------------
# What is DatoCMS?
<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agency partners, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Quick links:**

- ⚡️ Get started with a [free DatoCMS account](https://dashboard.datocms.com/signup)
- 🔖 Go through the [docs](https://www.datocms.com/docs)
- ⚙️ Get [support from us and the community](https://community.datocms.com/)
- 🆕 Stay up to date on new features and fixes on the [changelog](https://www.datocms.com/product-updates)

**Our featured repos:**
- [datocms/react-datocms](https://github.com/datocms/react-datocms): React helper components for images, Structured Text rendering, and more
- [datocms/js-rest-api-clients](https://github.com/datocms/js-rest-api-clients): Node and browser JavaScript clients for updating and administering your content. For frontend fetches, we recommend using our [GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api) instead.
- [datocms/cli](https://github.com/datocms/cli): Command-line interface that includes our [Contentful importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [Wordpress importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress)
- [datocms/plugins](https://github.com/datocms/plugins): Example plugins we've made that extend the editor/admin dashboard
- [datocms/gatsby-source-datocms](https://github.com/datocms/gatsby-source-datocms): Our Gatsby source plugin to pull data from DatoCMS
- Frontend examples in different frameworks: [Next.js](https://github.com/datocms/nextjs-demo), [Vue](https://github.com/datocms/vue-datocms) and [Nuxt](https://github.com/datocms/nuxtjs-demo), [Svelte](https://github.com/datocms/datocms-svelte) and [SvelteKit](https://github.com/datocms/sveltekit-demo), [Astro](https://github.com/datocms/datocms-astro-blog-demo), [Remix](https://github.com/datocms/remix-example). See [all our starter templates](https://www.datocms.com/marketplace/starters).

Or see [all our public repos](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)
<!--datocms-autoinclude-footer end-->
