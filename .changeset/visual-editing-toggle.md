---
"react-datocms": minor
---

Add a Visual Editing toolbar: `<ContentLink toggle />` (or `<VisualEditingToggle controller={controller} />` with `useContentLink`) shows a floating, draggable bar to turn click-to-edit on and off, highlight editable elements and, with `exitDraftModeUrl`, exit draft mode. The editor's choice is remembered. `useContentLink` now re-renders once its `controller` exists, so the returned `controller` is no longer `null` after mount. `react-dom` is now a peer dependency.
