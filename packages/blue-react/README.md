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

## Breaking changes between v10 and v11

### Fundamental changes in `MenuItem`

-   Removed props
    -   onClickAttached
    -   iconClassName
    -   labelClassName
    -   caretClassName
    -   caretStyle
    -   isHome
    -   dropdownClassName
    -   dropdownStyle
    -   showDropdown
    -   onShowDropdown
    -   supportOutside
    -   outsideIgnoreClasses
-   Renamed
    -   iconForActive -> iconForCurrent
    -   isActive -> current
    -   highlighted -> active
-   Changed behviour. Menu item no longer has built in styling if `draggable`. But since Menu item extends HTML Button or A element, props `draggable`, `onDragStart` etc. should still work.
-   Added
    -   sm
    -   lg
    -   iconBefore
    -   iconAfter
    -   labelHidden
    -   busy
    -   success
    -   defaultDisplay
    -   buttonContent
    -   as

The previous Menu Item with the older API is still available as `LegacyMenuItem`, but will be removed in a future release. Because of styling changes in Blue Web, it might not behave the same.

### Removed deprecated components

-   Body
-   Page
-   SidebarToggler
