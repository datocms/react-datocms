---
"react-datocms": patch
---

`require("react-datocms")` and every `require` of a subpath (`react-datocms/seo`,
`react-datocms/image`, …) threw `ReferenceError: exports is not defined in ES
module scope` on Node. The CommonJS build in `dist/cjs` now carries its own
`package.json` with `"type": "commonjs"`, so Node loads it as CommonJS. `import`
and bundled apps are unaffected.
