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
- [StructuredText integration](#structuredtext-integration)
  - [Edit groups](#edit-groups)
  - [Edit boundaries for embedded blocks](#edit-boundaries-for-embedded-blocks)
  - [Complete example with both attributes](#complete-example-with-both-attributes)
- [Manual overlays](#manual-overlays)
  - [Using `data-datocms-content-link-url`](#using-data-datocms-content-link-url)
  - [Using `data-datocms-content-link-source`](#using-data-datocms-content-link-source)
- [Low-level utilities](#low-level-utilities)
  - [`decodeStega`](#decodestega)
  - [`stripStega`](#stripstega)
- [Troubleshooting](#troubleshooting)
  - [Click-to-edit overlays not appearing](#click-to-edit-overlays-not-appearing)
  - [Navigation not syncing with Web Previews plugin](#navigation-not-syncing-with-web-previews-plugin)
  - [StructuredText blocks not clickable](#structuredtext-blocks-not-clickable)

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

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `scrollToNearestTarget` | `boolean` | `false` | Automatically scroll to the nearest editable element if none is currently visible in the viewport |
| `hoverOnly` | `boolean` | `false` | Only enable click-to-edit on devices that support hover (non-touch). Uses `window.matchMedia('(hover: hover)')` to detect hover capability. On touch-only devices, users can still toggle manually with Alt/Option key |

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

| Prop                | Type                                      | Default | Description                                                                                                                                            |
| ------------------- | ----------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onNavigateTo`      | `(path: string) => void`                  | -       | Callback when [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) requests navigation to a different page |
| `currentPath`       | `string`                                  | -       | Current pathname to sync with [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews)                         |
| `enableClickToEdit` | `boolean \| ClickToEditOptions` | -       | Enable click-to-edit overlays on mount. Pass `true` or an object with options. If `false`/`undefined`, click-to-edit is disabled (use Alt/Option key to toggle) |
| `stripStega`        | `boolean`                                 | -       | Whether to strip stega encoding from text nodes after stamping                                                                                         |
| `root`              | `React.RefObject<HTMLElement>`            | -       | Ref to limit scanning to this root element instead of the entire document                                                                              |

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

## StructuredText integration

When using DatoCMS's StructuredText fields, you may need additional configuration to ensure proper click-to-edit behavior, especially when embedding blocks within text.

### Edit groups

Wrap your StructuredText component with a `data-datocms-content-link-group` attribute to make the entire structured text area clickable:

```jsx
import { StructuredText, ContentLink } from 'react-datocms';

function Article({ content }) {
  return (
    <>
      <ContentLink />
      <div data-datocms-content-link-group>
        <StructuredText data={content.structuredTextField} />
      </div>
    </>
  );
}
```

### Edit boundaries for embedded blocks

When rendering custom blocks within StructuredText, use `data-datocms-content-link-boundary` to prevent click events from bubbling up to parent elements:

```jsx
import { StructuredText, ContentLink } from 'react-datocms';

function Article({ content }) {
  return (
    <>
      <ContentLink />
      <div data-datocms-content-link-group>
        <StructuredText
          data={content.structuredTextField}
          renderBlock={({ record }) => {
            if (record.__typename === 'ImageBlock') {
              return (
                <div data-datocms-content-link-boundary>
                  <img src={record.image.url} alt={record.image.alt} />
                  <p>{record.caption}</p>
                </div>
              );
            }
            if (record.__typename === 'QuoteBlock') {
              return (
                <blockquote data-datocms-content-link-boundary>
                  <p>{record.quote}</p>
                  <cite>{record.author}</cite>
                </blockquote>
              );
            }
            return null;
          }}
        />
      </div>
    </>
  );
}
```

### Complete example with both attributes

```jsx
import { StructuredText, ContentLink } from 'react-datocms';

function BlogPost({ post }) {
  return (
    <article>
      <ContentLink enableClickToEdit={true} />

      <header>
        <h1>{post.title}</h1>
        <time>{post.publishedAt}</time>
      </header>

      {/* Wrap StructuredText with edit group */}
      <div data-datocms-content-link-group className="prose">
        <StructuredText
          data={post.content}
          renderBlock={({ record }) => {
            switch (record.__typename) {
              case 'ImageBlock':
                return (
                  // Add boundary to prevent click bubbling
                  <figure data-datocms-content-link-boundary>
                    <img
                      src={record.image.url}
                      alt={record.image.alt}
                      width={record.image.width}
                      height={record.image.height}
                    />
                    {record.caption && <figcaption>{record.caption}</figcaption>}
                  </figure>
                );

              case 'VideoBlock':
                return (
                  <div data-datocms-content-link-boundary className="video-wrapper">
                    <video src={record.video.url} controls />
                  </div>
                );

              case 'CalloutBlock':
                return (
                  <aside data-datocms-content-link-boundary className="callout">
                    <strong>{record.title}</strong>
                    <p>{record.text}</p>
                  </aside>
                );

              default:
                return null;
            }
          }}
        />
      </div>
    </article>
  );
}
```

## Manual overlays

In some cases, you may want to manually create click-to-edit overlays for content that doesn't have stega encoding.

### Using `data-datocms-content-link-url`

You can add the `data-datocms-content-link-url` attribute with a DatoCMS editing URL:

```jsx
function ManualOverlay({ record }) {
  return (
    <div data-datocms-content-link-url={record._editingUrl}>
      <h2>{record.title}</h2>
      <p>{record.description}</p>
    </div>
  );
}
```

The `_editingUrl` field can be requested in your GraphQL query:

```graphql
query {
  allPosts {
    id
    title
    description
    _editingUrl
  }
}
```

### Using `data-datocms-content-link-source`

For elements without visible stega-encoded content, use the [`data-datocms-content-link-source`](https://github.com/datocms/content-link?tab=readme-ov-file#stamping-elements-via-data-datocms-content-link-source) attribute to attach stega metadata directly:

```jsx
// product.asset.video.alt contains stega-encoded info
<video
  src={product.asset.video.url}
  data-datocms-content-link-source={product.asset.video.alt}
  controls
/>
```

This is useful for structural elements like `<video>`, `<audio>`, or `<iframe>` where stega encoding in visible text would be problematic.

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
1. Wrap StructuredText with `data-datocms-content-link-group`:
   ```jsx
   <div data-datocms-content-link-group>
     <StructuredText data={content} />
   </div>
   ```

2. Add `data-datocms-content-link-boundary` to custom blocks:
   ```jsx
   renderBlock={(record) => (
     <div data-datocms-content-link-boundary>
       <CustomBlock record={record} />
     </div>
   )}
   ```
