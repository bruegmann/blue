# Blue Web

Blue Web is the base library for [Blue React](https://bruegmann.github.io/blue-react) and [Blue Blazor](https://bruegmann.github.io/blue-react). This library builds heavily on top of [Bootstrap](https://getbootstrap.com/docs/) and also provides additional solutions in CSS and JavaScript.

## Use Blue Web

Install with NPM:

```
npm i blue-web
```

[![npm version](https://img.shields.io/npm/v/blue-web)](https://www.npmjs.com/package/blue-web)

## Implementation

If you have a React or Blazor project, you should use the components of [Blue React](https://bruegmann.github.io/blue-react) or [Blue Blazor](https://bruegmann.github.io/blue-blazor). Otherwise you can also write the markup of those components directly in HTML. Check out the examples in the docs to find out how.

For the JavaScript solutions you have to import the associated file. When installed using NPM, you can do it like this:

```js
import "blue-web/dist/js/message.js"
import "blue-web/dist/js/progress.js"
// ...
```

**Important:** Since 1.14.0 JavaScript files are compiled as ES modules. When you embed them in HTML using the `<script>` don't forget the `type="module"` attribute.

You can also use a CDN like unpkg.com. Only recommended for testing, not for production.

```html
<script type="module" src="https://unpkg.com/blue-web@latest/dist/js/message.js"></script>
<script type="module" src="https://unpkg.com/blue-web@latest/dist/js/progress.js"></script>
<!-- ... -->
```

JavaScript files are compiled as ES modules. This allows you to use import functions like this:

```html
<script type="module">
    import { tell } from "https://unpkg.com/blue-web@latest/dist/js/message.js"
    tell("You are awesome!")
</script>
```

## Customization and theming

For changes specific to Blue's styles, see the [Blue Web migration guide](MIGRATION.md). React component changes have a [separate guide](../blue-react/MIGRATION.md).

Blue Web now uses **Bootstrap 6.0.0-alpha.1**. This is a breaking, prerelease upgrade: migrate Bootstrap classes and markup as well as your Sass. See the [Bootstrap migration guide](https://getbootstrap.com/docs/6.0/migration/).

Sass uses modules rather than global imports. Blue's configuration is forwarded by the entrypoint; configure it once with `@use ... with`. Bootstrap token maps merge overrides with their defaults. Blue's additional settings live in [dist/styles/_variables.scss](dist/styles/_variables.scss).

Here is an example of how to override variables using Sass:

```scss
// Stylesheet for Blue Web. Already contains Bootstrap.
@use "blue-web/dist/style" with (
    $primary: tomato,
    $theme: orange,
    $theme-dark: #995f00,
    $radius: 0.7rem,
    $root-tokens: (
        --body-font-family: (
            "Inter",
            sans-serif
        ),
        --focus-ring-width: 0.125rem
    ),
    $accordion-tokens: (
        --accordion-padding-x: 1rem
    )
);
```

For the Sass CLI, add `--load-path=node_modules`. Bundlers must resolve the `bootstrap/scss/*` modules from `node_modules`. Additional Blue partials declare their own dependencies; do not concatenate them or pre-import Bootstrap's configuration with conflicting settings. To configure Bootstrap directly, do so **before** loading Blue.

Both the compiled Blue CSS and Sass output use **unprefixed Bootstrap 6 tokens** (`--primary-base`, `--bg-body`, `--radius-5`). Bootstrap's own prebuilt CSS uses `--bs-*`; do not mix it with Blue's stylesheet.

An example of how to override CSS variables:

```css
:root {
    /* Override Bootstrap CSS variable */
    --body-font-family: "Inter", sans-serif;

    /* Override Blue Web CSS variable */
    --blue-layout-bg: #333;
}
```

Use `light-dark()` for adaptive colors and `data-bs-theme="light"` / `"dark"` to force a mode. Without a forced mode, CSS follows the OS preference.

### Migrating existing consumers

- Replace `@import` with `@use ... with`; setting global Sass variables before an import no longer configures Blue.
- Replace v5 scalar variables such as `$border-radius` with `$radius`, and component scalars with their `$*-tokens` maps.
- Replace `--bs-body-bg`, `--bs-body-color`, and `--bs-primary` with `--bg-body`, `--fg-body`, and `--primary-base`. RGB tokens are gone; use `color-mix()`.
- Use `lg:d-none`, `md:col-6`, and `2xl:*` responsive classes. Blue retains its existing viewport thresholds (992px, 1200px, 1400px) under the new names.
- Use `btn-solid theme-primary`, `btn-subtle theme-primary`, and `btn-text theme-primary`. The custom button variants have been removed: replace `blue-btn-soft-*` with `theme-* btn-subtle` and `blue-btn-plain-*` with `theme-* btn-text`. Map legacy `light`/`dark` suffixes to `secondary`/`inverse`. Blue's `theme-theme` remains available for the configured Blue theme color.
- Dialogs and drawers must be native `<dialog>` elements with `.dialog` or `.drawer`; remove the old content/positioning wrappers. `.blue-modal` and `.blue-lg-modal` remain Blue hooks on that same element.
- Bootstrap JavaScript is ESM-only; import `Dialog`, `Drawer`, and `Menu` instead of `Modal`, `Offcanvas`, and `Dropdown`. Remove `@types/bootstrap`; the alpha includes declarations.
- Blue overrides are in `@layer custom`, so Bootstrap helpers and utilities can still override them.

The flattened `merged.scss` distribution and its merge script have been removed: flattening loses module scope and configuration. The docs' legacy Theme Generator is unavailable in this alpha.
