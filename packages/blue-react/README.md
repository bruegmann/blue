# Blue React

[![npm version](https://img.shields.io/npm/v/blue-react)](https://www.npmjs.com/package/blue-react)

## Use Blue React

### Create new project with [Vite](https://vitejs.dev/)

To quickly getting started, you can use the [template with Vite, React, TypeScript and Blue React](https://github.com/bruegmann/vite-template-blue-react).
You can use degit to create a new project with this command:

```
npx degit bruegmann/vite-template-blue-react name-of-my-app
```

### Install to existing project

```
npm i blue-react
```

`blue-react` has `blue-web` and `bootstrap` as dependencies, so these will be installed automatically.

## Bootstrap 6 Alpha migration

See the [Blue React component migration guide](MIGRATION.md) for before/after examples and component-specific changes.

Blue React and Blue Web now require Bootstrap **6.0.0-alpha.1**. Use Blue Web's stylesheet, not an additional Bootstrap prebuilt stylesheet. See [Blue Web's migration and Sass configuration](../blue-web/README.md#customization-and-theming).

`Button` keeps its `filled`, `soft`, `plain`, and `outline` prop values, but renders Bootstrap 6 variant/theme classes: `soft` uses `btn-subtle`, and `plain` uses `btn-text`, alongside `theme-*`. It no longer needs Blue's removed custom button variants. `accent` and `inverse` colors are available; legacy `light`/`dark` color props map to `secondary`/`inverse`, and `theme` uses Blue's `theme-theme`.

Replace the `Button` prop `square` with `icon`. When `icon` is set, the component uses Bootstrap's `btn-icon` instead of the base `btn` class. Provide an accessible name, such as `aria-label`, for icon-only buttons.

Without a `variant` or `color`, `Button` uses only the base `btn` class (or `btn-icon` when `icon` is set). Explicit variants still default to the secondary theme; an explicit color without a variant uses `soft`.

Icons and busy indicators no longer add `icon-link` automatically. To enable icon hover styling, pass `className="icon-link icon-link-hover"` explicitly.

`Modal`, `ModalProvider`, and `useModal` keep their public names. The rendered element is now a native Bootstrap `Dialog`, with `shown.bs.dialog` / `hidden.bs.dialog` events. Empty prompt submissions return an empty string. Accordion items use native details/summary markup and an explicit icon.

Custom class names, Bootstrap event listeners, and CSS variable overrides passed to components must use Bootstrap 6 names. Blue's CSS uses unprefixed Bootstrap tokens and retains `--blue-*` tokens.

## Breaking changes between v11 and v12

### Changes in Layout component

`children` doesn't get wrapped around a `div.blue-layout-body` anymore. Put your page's content into the `page` slot instead:

```diff
- <Layout><h1>Hello World</h1></Layout>
+ <Layout page={<h1>Hello World</h1>} />
```

This lets you place other elements, such as the new `LayoutSplitter` component, in the layout's main area through `children`.

## Breaking changes between v10 and v11

### Fundamental changes in `MenuItem`

- Removed props
    - onClickAttached
    - iconClassName
    - labelClassName
    - caretClassName
    - caretStyle
    - isHome
    - dropdownClassName
    - dropdownStyle
    - showDropdown
    - onShowDropdown
    - supportOutside
    - outsideIgnoreClasses
- Renamed
    - iconForActive -> iconForCurrent
    - isActive -> current
    - highlighted -> active
- Changed behviour. Menu item no longer has built in styling if `draggable`. But since Menu item extends HTML Button or A element, props `draggable`, `onDragStart` etc. should still work.
- Added
    - sm
    - lg
    - iconBefore
    - iconAfter
    - labelHidden
    - busy
    - success
    - defaultDisplay
    - buttonContent
    - as

The previous Menu Item with the older API is still available as `LegacyMenuItem`, but will be removed in a future release. Because of styling changes in Blue Web, it might not behave the same.

### Removed deprecated components

- Body
- Page
- SidebarToggler
