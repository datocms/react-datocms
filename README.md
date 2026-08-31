<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

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

* [`<RSCImage />` and `<Image />` components for responsive/progressive images](./docs/image.md)
* [`<StructuredText />` component](./docs/structured-text.md)
* [`<VideoPlayer />` component](./docs/video-player.md)
* [`<ContentLink />` component and `useContentLink()` hook for Visual Editing with click-to-edit overlays](./docs/content-link.md)
* [`useQuerySubscription()` hook for live, real-time updates of content](./docs/live-real-time-updates.md)
* [`useSiteSearch()` hook to render a DatoCMS Site Search form widget](./docs/site-search.md)
* [`renderMetaTags()` and other helpers to render social share, SEO and Favicon meta tags](./docs/meta-tags.md)

# Demos

For fully working examples take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

Live demo: [https://react-datocms-example.netlify.app/](https://react-datocms-example.netlify.app/)

# Development

This repository contains a number of demos/examples. You can use them to locally test your changes.

```
cd examples
npm setup
npm run start
```

# Releasing (maintainers)

Every user-visible change needs a changeset: run `npx changeset` from the repo
root in the same PR, pick the bump level (`patch` is for bug fixes only, new API
surface is `minor`) and commit the file it writes under `.changeset/`. That is
where the changelog entry comes from, and it is where the bump level is decided
— not on release day. See [`.changeset/README.md`](.changeset/README.md).

To release, from an up-to-date, clean `master`, run `npm run release`. It
builds and tests, applies the pending changesets — bumping the version and
writing `CHANGELOG.md` — publishes to npm, and only then tags `vX.Y.Z`, pushes,
and creates a GitHub release whose notes come straight from that changelog
entry. An interrupted release is resumed by re-running it, never undone. Use
`npm run release:next` for a prerelease under the `next` dist-tag.

The script is
[`@datocms/release-toolchain`](https://github.com/datocms/release-toolchain),
shared with every other DatoCMS repository and pinned here by tag.

<!--datocms-autoinclude-footer start-->

---

# Trying a change before it's released

Every push to a branch here publishes a preview of the package, which you can
install anywhere — no npm release, no `npm link`:

```
npm i https://pkg.pr.new/datocms/react-datocms@<commit-sha>
```

The exact URL shows up in the commit's check run on GitHub, and in a comment on
the pull request once there is one. This is the supported way to try a change
inside a site that lives in another repository, or to hand a fix to whoever
reported it before it is released.

Previews are throwaway: they are never published to npm, and the URL stops
resolving after a while. Never commit one to a `package.json` that ships.

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**
- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->
