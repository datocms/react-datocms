// Pure, server-safe stega helpers, re-exported from @datocms/content-link.
//
// This subpath exists so that client components (or any code) can import these
// utilities without pulling in the package barrel — which includes VideoPlayer
// and therefore @mux. Since @datocms/content-link has no @mux dependency, this
// entry stays lean regardless of how well the consumer's bundler tree-shakes.
//
// Do NOT add a 'use client' directive here, and do NOT re-export these from a
// 'use client' module: they are pure functions and must remain usable in React
// Server Components.
export { decodeStega, revealStega, stripStega } from '@datocms/content-link';
export type { Controller } from '@datocms/content-link';
