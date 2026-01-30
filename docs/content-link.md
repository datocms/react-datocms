# ContentLink component for Visual Editing

`<ContentLink />` is a React component that enables **Visual Editing** for your DatoCMS content. It allows content editors to click directly on content in your website preview to edit it in the DatoCMS interface, making content management intuitive and efficient.

Visual Editing works by:
- Detecting stega-encoded metadata embedded in your content
- Creating interactive overlays on editable content
- Integrating with the DatoCMS [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) for seamless editing
- Supporting keyboard shortcuts (Alt/Option key) for temporary click-to-edit mode
- Providing bidirectional communication between your preview and the DatoCMS editor

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What is Visual Editing?](#what-is-visual-editing)
- [Out-of-the-box features](#out-of-the-box-features)
- [Installation](#installation)
- [Basic Setup](#basic-setup)
  - [1. Fetch content with stega encoding](#1-fetch-content-with-stega-encoding)
  - [2. Add the ContentLink component](#2-add-the-contentlink-component)
- [Framework integrations](#framework-integrations)
  - [Next.js App Router](#nextjs-app-router)
  - [React Router](#react-router)
- [Enabling click-to-edit](#enabling-click-to-edit)
  - [1. Via prop (persistent)](#1-via-prop-persistent)
  - [2. Via keyboard shortcut (temporary)](#2-via-keyboard-shortcut-temporary)
- [Flash-all highlighting](#flash-all-highlighting)
- [Props](#props)
- [Advanced usage: the `useContentLink` hook](#advanced-usage-the-usecontentlink-hook)
  - [Hook API](#hook-api)
  - [Example: Custom editing toolbar](#example-custom-editing-toolbar)
  - [Example: Conditional editing in different environments](#example-conditional-editing-in-different-environments)
- [Data attributes reference](#data-attributes-reference)
  - [Developer-specified attributes](#developer-specified-attributes)
    - [`data-datocms-content-link-url`](#data-datocms-content-link-url)
    - [`data-datocms-content-link-source`](#data-datocms-content-link-source)
    - [`data-datocms-content-link-group`](#data-datocms-content-link-group)
    - [`data-datocms-content-link-boundary`](#data-datocms-content-link-boundary)
  - [Library-managed attributes](#library-managed-attributes)
    - [`data-datocms-contains-stega`](#data-datocms-contains-stega)
    - [`data-datocms-auto-content-link-url`](#data-datocms-auto-content-link-url)
- [How group and boundary resolution works](#how-group-and-boundary-resolution-works)
- [Structured Text fields](#structured-text-fields)
  - [Rule 1: Always wrap the Structured Text component in a group](#rule-1-always-wrap-the-structured-text-component-in-a-group)
  - [Rule 2: Wrap embedded blocks, inline records, and inline blocks in a boundary](#rule-2-wrap-embedded-blocks-inline-records-and-inline-blocks-in-a-boundary)
- [Low-level utilities](#low-level-utilities)
  - [`decodeStega`](#decodestega)
  - [`stripStega`](#stripstega)
- [Troubleshooting](#troubleshooting)
  - [Click-to-edit overlays not appearing](#click-to-edit-overlays-not-appearing)
  - [Navigation not syncing with Web Previews plugin](#navigation-not-syncing-with-web-previews-plugin)
  - [StructuredText blocks not clickable](#structuredtext-blocks-not-clickable)
  - [Layout issues caused by stega encoding](#layout-issues-caused-by-stega-encoding)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is Visual Editing?

Visual Editing transforms how content editors interact with your website. Instead of navigating through forms and fields in a CMS, editors can:

1. **See their content in context** - Preview exactly how content appears on the live site
2. **Click to edit** - Click directly on any text, image, or field to open the editor
3. **Navigate seamlessly** - Jump between pages in the preview, and the CMS follows along
4. **Get instant feedback** - Changes in the CMS are reflected immediately in the preview

This drastically improves the editing experience, especially for non-technical users who can now edit content without understanding the underlying CMS structure.

## Out-of-the-box features

- **Click-to-edit overlays**: Visual indicators showing which content is editable
- **Stega decoding**: Automatically detects and decodes editing metadata embedded in content
- **Keyboard shortcuts**: Hold Alt/Option to temporarily enable editing mode
- **Flash-all highlighting**: Show all editable areas at once for quick orientation
- **Bidirectional navigation**: Sync navigation between preview and DatoCMS editor
- **Framework-agnostic**: Works with Next.js, React Router, Remix, or any routing solution
- **StructuredText integration**: Special support for complex structured content fields
- **[Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) integration**: Seamless integration with DatoCMS's editing interface

## Installation

```bash
npm install --save react-datocms
```

The package includes `@datocms/content-link` as a dependency, which provides the underlying controller for Visual Editing functionality.

## Basic Setup

Visual Editing requires two steps:

### 1. Fetch content with stega encoding

When fetching content from DatoCMS, enable stega encoding to embed editing metadata:

```js
import { executeQuery } from '@datocms/cda-client';

const query = `
  query {
    page {
      title
      content
    }
  }
`;

const result = await executeQuery(query, {
  token: 'YOUR_API_TOKEN',
  environment: 'main',
  // Enable stega encoding
  contentLink: 'v1',
  // Set your site's base URL for editing links
  baseEditingUrl: 'https://your-project.admin.datocms.com',
});
```

The `contentLink: 'v1'` option enables stega encoding, which embeds invisible metadata into text fields. The `baseEditingUrl` tells DatoCMS where your project is located so edit URLs can be generated correctly. Both options are required.

### 2. Add the ContentLink component

Add the `<ContentLink />` component to your app (typically in a root layout or provider):

```jsx
import { ContentLink } from 'react-datocms';

function App() {
  return (
    <>
      <ContentLink />
      {/* Your content */}
    </>
  );
}
```

That's it! The component will automatically scan your page for encoded content and enable Visual Editing.

## Framework integrations

For full [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) integration, provide navigation callbacks to sync the preview with the CMS:

### Next.js App Router

```jsx
'use client';

import { ContentLink as DatoContentLink } from 'react-datocms';
import { useRouter, usePathname } from 'next/navigation';

export function ContentLink() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DatoContentLink
      onNavigateTo={(path) => router.push(path)}
      currentPath={pathname}
    />
  );
}
```

Then include this in your root layout:

```jsx
// app/layout.tsx
import { ContentLink } from './ContentLink';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ContentLink />
        {children}
      </body>
    </html>
  );
}
```

### React Router

```jsx
import { ContentLink as DatoContentLink } from 'react-datocms';
import { useNavigate, useLocation } from 'react-router-dom';

export function ContentLink() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <DatoContentLink
      onNavigateTo={(path) => navigate(path)}
      currentPath={location.pathname}
    />
  );
}
```

## Enabling click-to-edit

There are two ways to enable click-to-edit mode:

### 1. Via prop (persistent)

```jsx
<ContentLink enableClickToEdit={true} />
```

Or with additional options:

```jsx
// Scroll to nearest editable element if none is visible
<ContentLink enableClickToEdit={{ scrollToNearestTarget: true }} />

// Only enable on devices with hover capability (non-touch)
<ContentLink enableClickToEdit={{ hoverOnly: true }} />

// Combine both options
<ContentLink enableClickToEdit={{ hoverOnly: true, scrollToNearestTarget: true }} />
```

**Available options (`ClickToEditOptions`):**

| Option                  | Type      | Default | Description                                                                                                                                                                                                            |
| ----------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scrollToNearestTarget` | `boolean` | `false` | Automatically scroll to the nearest editable element if none is currently visible in the viewport                                                                                                                      |
| `hoverOnly`             | `boolean` | `false` | Only enable click-to-edit on devices that support hover (non-touch). Uses `window.matchMedia('(hover: hover)')` to detect hover capability. On touch-only devices, users can still toggle manually with Alt/Option key |

This enables click-to-edit overlays immediately and keeps them visible.

### 2. Via keyboard shortcut (temporary)

Users can hold the **Alt** key (Windows/Linux) or **Option** key (Mac) to temporarily show click-to-edit overlays. This is useful for editors who want to toggle editing mode on-demand without permanently enabling it.

## Flash-all highlighting

The flash-all feature provides visual feedback by highlighting all editable elements on the page. This is useful for:
- Showing editors what content they can edit
- Debugging to verify Visual Editing is working correctly
- Onboarding new content editors

To trigger flash-all programmatically, use the `useContentLink` hook:

```jsx
import { useContentLink } from 'react-datocms';

function DebugButton() {
  const { flashAll } = useContentLink();

  return (
    <button onClick={() => flashAll(true)}>
      Show all editable areas
    </button>
  );
}
```

The `true` parameter scrolls to the nearest editable element, useful on long pages.

## Props

The `<ContentLink />` component accepts the following props:

| Prop                | Type                            | Default | Description                                                                                                                                                     |
| ------------------- | ------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onNavigateTo`      | `(path: string) => void`        | -       | Callback when [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) requests navigation to a different page          |
| `currentPath`       | `string`                        | -       | Current pathname to sync with [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews)                                  |
| `enableClickToEdit` | `boolean \| ClickToEditOptions` | -       | Enable click-to-edit overlays on mount. Pass `true` or an object with options. If `false`/`undefined`, click-to-edit is disabled (use Alt/Option key to toggle) |
| `stripStega`        | `boolean`                       | -       | Whether to strip stega encoding from text nodes after stamping                                                                                                  |
| `root`              | `React.RefObject<HTMLElement>`  | -       | Ref to limit scanning to this root element instead of the entire document                                                                                       |

## Advanced usage: the `useContentLink` hook

For more control over Visual Editing behavior, use the `useContentLink` hook directly. This is useful when you need to:
- Programmatically control click-to-edit mode
- Implement custom editing UIs
- React to editing state changes
- Integrate with custom frameworks or routing solutions

### Hook API

```typescript
import { useContentLink } from 'react-datocms';

const {
  controller,              // The underlying controller instance
  enableClickToEdit,       // Enable click-to-edit overlays
  disableClickToEdit,      // Disable click-to-edit overlays
  isClickToEditEnabled,    // Check if click-to-edit is enabled
  flashAll,                // Highlight all editable elements
  setCurrentPath,          // Notify Web Previews plugin of current path
} = useContentLink({
  // enabled can be:
  // - true (default): Enable with default settings (stega encoding preserved)
  // - false: Disable the controller
  // - { stripStega: true }: Enable and strip stega encoding for clean DOM
  enabled: true,
  onNavigateTo: (path) => { /* handle navigation */ },
  root: elementRef,
});
```

**Options:**

- `enabled?: boolean | { stripStega: boolean }` - Controls whether the controller is enabled and how it handles stega encoding:
  - `true` (default): Enables the controller with stega encoding preserved in the DOM (allows controller recreation)
  - `false`: Disables the controller completely
  - `{ stripStega: true }`: Enables the controller and permanently removes stega encoding from text nodes for clean `textContent` access
- `onNavigateTo?: (path: string) => void` - Callback when Web Previews plugin requests navigation
- `root?: React.RefObject<HTMLElement>` - Ref to limit scanning to this root element

**Note:** The `<ContentLink />` component allows controlling stega stripping through the `stripStega` prop. When undefined, the underlying library's default behavior is used.

### Example: Custom editing toolbar

```jsx
import { useContentLink } from 'react-datocms';
import { useState } from 'react';

function EditingToolbar() {
  const { enableClickToEdit, disableClickToEdit, isClickToEditEnabled, flashAll } = useContentLink({
    onNavigateTo: (path) => window.location.href = path,
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    if (isEditing) {
      disableClickToEdit();
    } else {
      enableClickToEdit({ scrollToNearestTarget: true });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="editing-toolbar">
      <button onClick={toggleEditing}>
        {isEditing ? 'Disable' : 'Enable'} Editing
      </button>
      <button onClick={() => flashAll(true)}>
        Show Editable Areas
      </button>
    </div>
  );
}
```

### Example: Conditional editing in different environments

```jsx
import { useContentLink } from 'react-datocms';

function ConditionalEditing() {
  const isDraftMode = process.env.NEXT_PUBLIC_DRAFT_MODE === 'true';

  const { enableClickToEdit } = useContentLink({
    enabled: isDraftMode,
    onNavigateTo: (path) => router.push(path),
  });

  // Only enable in draft mode
  useEffect(() => {
    if (isDraftMode) {
      enableClickToEdit();
    }
  }, [isDraftMode, enableClickToEdit]);

  return null;
}
```

## Data attributes reference

This library uses several `data-datocms-*` attributes. Some are **developer-specified** (you add them to your markup), and some are **library-managed** (added automatically during DOM stamping). Here's a complete reference.

### Developer-specified attributes

These attributes are added by you in your templates/components to control how editable regions behave.

#### `data-datocms-content-link-url`

Manually marks an element as editable with an explicit edit URL. Use this for non-text fields (booleans, numbers, dates, JSON) that cannot contain stega encoding. The recommended approach is to use the `_editingUrl` field available on all records:

```graphql
query {
  product {
    id
    price
    isActive
    _editingUrl
  }
}
```

```tsx
<span data-datocms-content-link-url={product._editingUrl}>
  ${product.price}
</span>
```

#### `data-datocms-content-link-source`

Attaches stega-encoded metadata without the need to render it as content. Useful for structural elements that cannot contain text (like `<video>`, `<audio>`, `<iframe>`, etc.) or when stega encoding in visible text would be problematic:

```tsx
<div data-datocms-content-link-source={video.alt}>
  <video src={video.url} poster={video.posterImage.url} controls />
</div>
```

The value must be a stega-encoded string (any text field from the API will work). The library decodes the stega metadata from the attribute value and makes the element clickable to edit.

#### `data-datocms-content-link-group`

Expands the clickable area to a parent element. When the library encounters stega-encoded content, by default it makes the immediate parent of the text node clickable to edit. Adding this attribute to an ancestor makes that ancestor the clickable target instead:

```tsx
<article data-datocms-content-link-group>
  {/* product.title contains stega encoding */}
  <h2>{product.title}</h2>
  <p>${product.price}</p>
</article>
```

Here, clicking anywhere in the `<article>` opens the editor, rather than requiring users to click precisely on the `<h2>`.

**Important:** A group should contain only one stega-encoded source. If multiple stega strings resolve to the same group, the library logs a collision warning and only the last URL wins.

#### `data-datocms-content-link-boundary`

Stops the upward DOM traversal that looks for a `data-datocms-content-link-group`, making the element where stega was found the clickable target instead. This creates an independent editable region that won't merge into a parent group (see [How group and boundary resolution works](#how-group-and-boundary-resolution-works) below for details):

```tsx
<div data-datocms-content-link-group>
  {/* page.title contains stega encoding → resolves to URL A */}
  <h1>{page.title}</h1>
  <section data-datocms-content-link-boundary>
    {/* page.author contains stega encoding → resolves to URL B */}
    <span>{page.author}</span>
  </section>
</div>
```

Without the boundary, clicking `page.author` would open URL A (the outer group). With the boundary, the `<span>` becomes the clickable target opening URL B.

The boundary can also be placed directly on the element that contains the stega text:

```tsx
<div data-datocms-content-link-group>
  {/* page.title contains stega encoding → resolves to URL A */}
  <h1>{page.title}</h1>
  {/* page.author contains stega encoding → resolves to URL B */}
  <span data-datocms-content-link-boundary>{page.author}</span>
</div>
```

Here, the `<span>` has the boundary and directly contains the stega text, so the `<span>` itself becomes the clickable target (since the starting element and the boundary element are the same).

### Library-managed attributes

These attributes are added automatically by the library during DOM stamping. You do not need to add them yourself, but you can target them in CSS or JavaScript.

#### `data-datocms-contains-stega`

Added to elements whose text content contains stega-encoded invisible characters. This attribute is only present when `stripStega` is `false` (the default), since with `stripStega: true` the characters are removed entirely. Useful for CSS workarounds — the zero-width characters can sometimes cause unexpected letter-spacing or text overflow:

```css
[data-datocms-contains-stega] {
  letter-spacing: 0 !important;
}
```

#### `data-datocms-auto-content-link-url`

Added automatically to elements that the library has identified as editable targets (through stega decoding and group/boundary resolution). Contains the resolved edit URL.

This is the automatic counterpart to the developer-specified `data-datocms-content-link-url`. The library adds `data-datocms-auto-content-link-url` wherever it can extract an edit URL from stega encoding, while `data-datocms-content-link-url` is needed for non-text fields (booleans, numbers, dates, etc.) where stega encoding cannot be embedded. Both attributes are used by the click-to-edit overlay system to determine which elements are clickable and where they link to.

## How group and boundary resolution works

When the library encounters stega-encoded content inside an element, it walks up the DOM tree from that element:

1. If it finds a `data-datocms-content-link-group`, it stops and stamps **that** element as the clickable target.
2. If it finds a `data-datocms-content-link-boundary`, it stops and stamps the **starting element** as the clickable target — further traversal is prevented.
3. If it reaches the root without finding either, it stamps the **starting element**.

Here are some concrete examples to illustrate:

**Example 1: Nested groups**

```tsx
<div data-datocms-content-link-group>
  {/* page.title contains stega encoding → resolves to URL A */}
  <h1>{page.title}</h1>
  <div data-datocms-content-link-group>
    {/* page.subtitle contains stega encoding → resolves to URL B */}
    <p>{page.subtitle}</p>
  </div>
</div>
```

- **`page.title`**: walks up from `<h1>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.subtitle`**: walks up from `<p>`, finds the inner group first → the **inner `<div>`** becomes clickable (opens URL B). The outer group is never reached.

Each nested group creates an independent clickable region. The innermost group always wins for its own content.

**Example 2: Boundary preventing group propagation**

```tsx
<div data-datocms-content-link-group>
  {/* page.title contains stega encoding → resolves to URL A */}
  <h1>{page.title}</h1>
  <section data-datocms-content-link-boundary>
    {/* page.author contains stega encoding → resolves to URL B */}
    <span>{page.author}</span>
  </section>
</div>
```

- **`page.title`**: walks up from `<h1>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.author`**: walks up from `<span>`, hits the `<section>` boundary → traversal stops, the **`<span>`** itself becomes clickable (opens URL B). The outer group is not reached.

**Example 3: Boundary inside a group**

```tsx
<div data-datocms-content-link-group>
  {/* page.description contains stega encoding → resolves to URL A */}
  <p>{page.description}</p>
  <div data-datocms-content-link-boundary>
    {/* page.footnote contains stega encoding → resolves to URL B */}
    <p>{page.footnote}</p>
  </div>
</div>
```

- **`page.description`**: walks up from `<p>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.footnote`**: walks up from `<p>`, hits the boundary → traversal stops, the **`<p>`** itself becomes clickable (opens URL B). The outer group is not reached.

**Example 4: Multiple stega strings without groups (collision warning)**

```tsx
<p>
  {/* Both product.name and product.tagline contain stega encoding */}
  {product.name}
  {product.tagline}
</p>
```

Both stega-encoded strings resolve to the same `<p>` element. The library logs a console warning and the last URL wins. To fix this, wrap each piece of content in its own element:

```tsx
<p>
  <span>{product.name}</span>
  <span>{product.tagline}</span>
</p>
```

## Structured Text fields

Structured Text fields require special attention because of how stega encoding works within them:

- The DatoCMS API encodes stega information inside a single `<span>` within the structured text output. Without any configuration, only that small span would be clickable.
- Structured Text fields can contain **embedded blocks** and **inline records**, each with their own editing URL that should open a different record in the editor.

Here are the rules to follow:

### Rule 1: Always wrap the Structured Text component in a group

This makes the entire structured text area clickable, instead of just the tiny stega-encoded span:

```tsx
<div data-datocms-content-link-group>
  <StructuredText data={page.content} />
</div>
```

### Rule 2: Wrap embedded blocks, inline records, and inline blocks in a boundary

Embedded blocks, inline records, and inline blocks have their own edit URL (pointing to the block/record). Without a boundary, clicking them would bubble up to the parent group and open the structured text field editor instead. Add `data-datocms-content-link-boundary` to prevent them from merging into the parent group:

```tsx
<div data-datocms-content-link-group>
  <StructuredText
    data={page.content}
    renderBlock={({ record }) => (
      <div data-datocms-content-link-boundary>
        <BlockComponent block={record} />
      </div>
    )}
    renderInlineRecord={({ record }) => (
      <span data-datocms-content-link-boundary>
        <InlineRecordComponent record={record} />
      </span>
    )}
    renderLinkToRecord={({ record, children, transformedMeta }) => (
      <a {...transformedMeta} href={`/resources/${record.slug}`}>
        {children}
      </a>
    )}
    renderInlineBlock={({ record }) => (
      <span data-datocms-content-link-boundary>
        <InlineBlockComponent record={record} />
      </span>
    )}
  />
</div>
```

With this setup:
- Clicking the main text (paragraphs, headings, lists) opens the **structured text field editor**
- Clicking an embedded block, inline record, or inline block opens **that record's editor**

**Why `renderLinkToRecord` doesn't need a boundary:** Record links are typicall just `<a>` tags wrapping text that already belongs to the surrounding structured text. Since they don't introduce a separate editing target, there's no URL collision and no reason to isolate them from the parent group.

## Low-level utilities

The `react-datocms` package re-exports utility functions from `@datocms/content-link` for working with stega-encoded content:

### `decodeStega`

Decodes stega-encoded content to extract editing metadata:

```typescript
import { decodeStega } from 'react-datocms';

const text = "Hello, world!"; // Contains invisible stega data
const decoded = decodeStega(text);

if (decoded) {
  console.log('Editing URL:', decoded.url);
  console.log('Clean text:', decoded.cleanText);
}
```

### `stripStega`

Removes stega encoding from any data type (strings, objects, arrays, primitives):

```typescript
import { stripStega } from 'react-datocms';

// Works with strings
stripStega("Hello‎World") // "HelloWorld"

// Works with objects
stripStega({ name: "John‎", age: 30 })

// Works with nested structures - removes ALL stega encodings
stripStega({
  users: [
    { name: "Alice‎", email: "alice‎.com" },
    { name: "Bob‎", email: "bob‎.co" }
  ]
})

// Works with arrays
stripStega(["First‎", "Second‎", "Third‎"])
```

These utilities are useful when you need to:
- Extract clean text for meta tags or social sharing
- Check if content has stega encoding
- Debug Visual Editing issues
- Process stega-encoded content programmatically

## Troubleshooting

### Click-to-edit overlays not appearing

**Problem**: Overlays don't appear when clicking on content.

**Solutions**:
1. Verify stega encoding is enabled in your API calls:
   ```js
   const result = await executeQuery(query, {
     token: 'YOUR_API_TOKEN',
     contentLink: 'v1',
     baseEditingUrl: 'https://your-project.admin.datocms.com',
   });
   ```

2. Check that `<ContentLink />` is mounted in your component tree

3. Ensure you've enabled click-to-edit mode:
   ```jsx
   <ContentLink enableClickToEdit={true} />
   ```
   Or hold Alt/Option key while browsing

4. Check browser console for errors

### Navigation not syncing with [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews)

**Problem**: When you navigate in your preview, the DatoCMS editor doesn't follow along.

**Solutions**:
1. Ensure you're providing both `onNavigateTo` and `currentPath` props:
   ```jsx
   <ContentLink
     onNavigateTo={(path) => router.push(path)}
     currentPath={pathname}
   />
   ```

2. Verify `currentPath` updates when navigation occurs

3. Check that `baseEditingUrl` in your API calls matches your preview URL

### StructuredText blocks not clickable

**Problem**: Content within StructuredText blocks doesn't have click-to-edit overlays.

**Solutions**:
1. Wrap StructuredText with `data-datocms-content-link-group` (see [Rule 1](#rule-1-always-wrap-the-structured-text-component-in-a-group)):
   ```jsx
   <div data-datocms-content-link-group>
     <StructuredText data={content} />
   </div>
   ```

2. Add `data-datocms-content-link-boundary` to custom blocks and inline blocks (see [Rule 2](#rule-2-wrap-embedded-blocks-and-inline-records-in-a-boundary)):
   ```jsx
   renderBlock={({ record }) => (
     <div data-datocms-content-link-boundary>
       <CustomBlock record={record} />
     </div>
   )}
   renderInlineBlock={({ record }) => (
     <span data-datocms-content-link-boundary>
       <CustomInlineBlock record={record} />
     </span>
   )}
   ```

### Layout issues caused by stega encoding

**Problem**: The invisible zero-width characters can cause unexpected letter-spacing or text breaking out of containers.

**Solutions**:
1. Use the `stripStega` prop to remove stega encoding after processing:
   ```jsx
   <ContentLink stripStega={true} />
   ```

2. Or use CSS to fix the letter-spacing issue:
   ```css
   [data-datocms-contains-stega] {
     letter-spacing: 0 !important;
   }
   ```
   This attribute is automatically added to elements with stega-encoded content when `stripStega` is `false` (the default).
