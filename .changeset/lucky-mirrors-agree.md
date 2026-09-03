---
'react-datocms': patch
---

Move to `datocms-structured-text` 6.x, so you don't end up with two copies of it

If your app already depends on `datocms-structured-text-utils` 6.x, you have been
getting a second copy of it — a 5.x one — tucked under react-datocms, because we
asked for `^5`. Two copies mean a bigger bundle and two versions of types that
should be one. This release asks for `^6` instead, and the duplicate goes away.

Nothing to do on your side, and nothing changes at runtime: 6.0.0 of these
packages was a version bump and nothing else, so every type and helper
react-datocms re-exports is exactly the one it re-exported before.
