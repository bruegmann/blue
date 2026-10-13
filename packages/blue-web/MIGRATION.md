# Blue Web style migration

This guide covers Blue Web's style changes made during the Bootstrap 6 alpha migration. It is not a general Bootstrap migration guide. React component changes are documented separately in the [Blue React migration guide](../blue-react/MIGRATION.md).

## Configure Blue through its Sass entrypoint

Blue's stylesheet no longer reads configuration from global Sass variables. Configure supported Sass settings through `@use ... with`:

```scss
// Before
$bla-sidebar-width: 20rem;
@import "blue-web/dist/style";
```

```scss
// After
@use "blue-web/dist/style" with (
    $blue: hsl(221, 97%, 53%),
    $sidebar-width: 20rem
);
```

`$bla-sidebar-width` is now `$sidebar-width`. The `$theme`, `$theme-dark`, and `$primary` settings from the removed `dist/styles/bootstrap-variables` module are no longer available; `$blue` configures Bootstrap's blue palette instead. The `style` entrypoint also no longer exposes `$radius`, `$root-tokens`, `$accordion-tokens`, or `$utilities` for configuration. Removed Blue settings also include `$shimmering`, `$scrollbar-thumb-color`, `$actions-height`, `$bla-button-bg-normal`, `$bla-button-bg-hover`, `$bla-btn-font-size`, `$bla-header-nav-padding`, the old sidebar/app/header background and foreground settings, and `$actions-control-bg-hover`. The `$theme-colors` Bootstrap setting and Blue's current Sass variables remain available through the entrypoint; see [Bootstrap settings](dist/styles/_bootstrap.scss) and [Blue-specific variables](dist/styles/_variables.scss).

- Keep `node_modules` on your Sass load path, for example `sass --load-path=node_modules app.scss app.css`.
- Stop loading `blue-web/dist/merged.scss`; the flattened Sass distribution was removed. Load `blue-web/dist/style` instead.
- Do not concatenate Blue's Sass partials or depend on variables/mixins becoming global when another partial is imported.
- A direct `@use` of `dist/styles/variables` supplies settings, not Blue's root CSS variables. Load the main stylesheet to emit the complete styles.

Use a namespace when calling Blue's forwarded mixins:

```scss
@use "blue-web/dist/style" as blue;

.page {
    @include blue.blue-layout-body(var(--bg-body));
}
```

## Remove experimental neumorphism

The experimental neumorphism feature has been removed completely. Remove imports of `blue-web/dist/neu.scss` (including module imports without the extension) and links to `neu.css` or `neu.min.css`.

Remove calls to the `neu` and `neu-define-utility-classes` mixins, the `neu-shadow` function, and overrides of `$neu-steps`. The `.neu-shadow-*` utility classes and `--neu-*` CSS variables are no longer supplied. Replace any remaining usage with your own application styles if needed; Blue provides no compatibility layer or direct replacement.

The `build-neu-css` command and the CSS Neumorphism documentation page have also been removed.

## Review overrides of Blue styles

Blue's additional styles now live in the `custom` cascade layer. Utilities can override them; custom overrides must account for cascade-layer precedence rather than relying only on selector specificity or source order.

The generated root tokens have changed. Blue no longer emits `--blue-app-bg`, `--blue-scrollbar-thumb-color-rgb`, `--blue-sidebar-bg`, `--blue-sidebar-color`, `--blue-header-bg`, `--blue-header-color`, `--blue-theme`, `--blue-shimmering`, or `--blue-action-link-bg-color`; `.theme-theme` no longer receives Blue-specific theme tokens. The root now emits structural tokens such as `--blue-sidebar-width`, `--blue-header-height`, `--blue-menu-item-indicator-bg`, `--blue-menu-item-height`, and `--blue-corner-shape`. The old Sass settings for the removed colors and backgrounds are gone as well.

Blue's layout background now uses `--blue-layout-bg`. Override current Bootstrap theme tokens or define your own application tokens instead of relying on the removed Blue background variables. For example:

```css
:root {
    --blue-layout-bg: #202020;
}
```

Blue no longer sets the body background from `--blue-app-bg`. Status backgrounds now use the semantic `--primary-bg`, `--success-bg`, `--info-bg`, `--warning-bg`, and `--danger-bg` tokens instead of Blue's fixed Sass colors. Override the current semantic tokens if you need different colors.

Blue now supplies its Inter font stack through `--blue-font-family`. The default body font references that token; an explicitly configured body font is no longer overwritten by Blue's Inter styles.

Blue's compiled stylesheet and source Sass both use unprefixed base tokens. Do not add Bootstrap's separately compiled, prefixed stylesheet alongside Blue's CSS. For custom overrides of Blue elements, use the token names consumed by the current Blue source rather than assuming `--bs-*` aliases exist.

## Replace Blue's CSS-only tabs

Blue's `.blue-tabs`, `.blue-tab`, and `.blue-tab-content` styles have been removed. The `--blue-tabs-underline-active-font-weight` custom property is also no longer used. Use Bootstrap's `.nav.nav-tabs` or `.nav.nav-underline`, `.nav-link`, and `.tab-content` / `.tab-pane` classes instead. For standalone HTML tabs, follow Bootstrap's tab markup and load its JavaScript plugin to activate the buttons.

Blue React's `Tabs` and `Tab` components keep their public props and manage tab activation in React, so they do not require Bootstrap's JavaScript plugin. Update custom CSS selectors that target the removed Blue tab classes.

## Replace removed Blue button variants

Blue no longer defines the `blue-btn-soft-*` or `blue-btn-plain-*` classes.

| Removed Blue class       | Replacement                    |
| ------------------------ | ------------------------------ |
| `blue-btn-soft-primary`  | `theme-primary btn-subtle`     |
| `blue-btn-plain-primary` | `theme-primary btn-text`       |
| `blue-btn-soft-light`    | `theme-secondary btn-subtle`   |
| `blue-btn-plain-light`   | `theme-secondary btn-text`     |
| `blue-btn-soft-dark`     | `theme-inverse btn-subtle`     |
| `blue-btn-plain-dark`    | `theme-inverse btn-text`       |
| `blue-btn-soft-theme`    | app theme class + `btn-subtle` |
| `blue-btn-plain-theme`   | app theme class + `btn-text`   |

Apply the same replacement to other color suffixes, such as `success`, `danger`, `warning`, and `info`. Replace custom selectors targeting the removed classes as well as markup.

Blue no longer provides `theme-theme` as a configured theme backed by `--blue-theme`; define any application-specific theme tokens and styles yourself. The button variants themselves are supplied by Bootstrap.

Blue's `blue-btn-icon-wrapper` helper remains available. The `blue-btn-square` CSS helper has been removed. Replace `btn blue-btn-square` with `btn-icon` for icon-only buttons, retaining an accessible name. React consumers should use the Button's `icon` prop.

## Replace the legacy action-menu styles

The responsive `.blue-legacy-actions` and `.blue-legacy-actions-menu` styles and the `actions()` and `show-action-menu-again()` mixins have been removed. The deprecated Blue React `ActionMenu` still emits these class names, but Blue Web no longer supplies their responsive styling. Migrate React consumers to `Actions`, or provide and maintain equivalent application styles.

The `header-bg()` mixin and its `dist/styles/mixins/_misc.scss` partial have also been removed. Replace direct imports or calls with application-owned styling.

## Replace Blue's input group

The `blue-input-group` class and its Sass partial have been removed. Use `form-control form-adorn` on the wrapper, `form-adorn-icon` on the icon container, and `form-ghost` on the input. This is a markup migration, not just a wrapper-class rename:

```html
<!-- Before -->
<div class="blue-input-group input-group rounded-pill">
    <label for="search" class="input-group-text">
        <!-- Search icon -->
        <span class="visually-hidden">Search</span>
    </label>
    <input id="search" type="search" class="form-control" />
</div>

<!-- After -->
<div class="form-control form-adorn rounded-pill">
    <label for="search" class="form-adorn-icon">
        <!-- Search icon -->
        <span class="visually-hidden">Search</span>
    </label>
    <input id="search" type="search" class="form-ghost" />
</div>
```

Keep the input's accessible label and any rounding utilities. Remove overrides targeting `blue-input-group`, its `.focus` state, or its `.input-group-text` descendants; style the new wrapper and adornment classes instead. The wrapper now supplies the border and focus ring.

The Blue CSS Input group docs page has been removed because these styles are supplied by Bootstrap, not Blue.

## Update markup using Blue's dialog hooks

The `blue-modal` hook remains, but no longer supplies the old positioning/content wrappers or backdrop form. Put it on the native dialog or drawer itself. A form directly inside `dialog.blue-modal` is styled with `display: contents`.

For Blue's responsive drawer hooks, remove the nested offcanvas wrapper and put the drawer classes on the element carrying `blue-modal` and `blue-lg-modal`:

```html
<dialog class="blue-modal blue-lg-modal drawer drawer-start" aria-labelledby="navigation-title" closedby="any">
    <div class="drawer-header">
        <h2 class="drawer-title" id="navigation-title">Navigation</h2>
    </div>
    <div class="drawer-body">...</div>
</dialog>
```

Remove `.blue-modal-backdrop` markup. It is retained only as a hidden compatibility selector, not as the dismissal mechanism.

Blue's responsive hooks now inspect and style the dialog itself. Above the selected breakpoint it becomes inline content; its direct drawer header is hidden and body padding is removed. Custom selectors must no longer depend on a nested `.offcanvas`.

The viewport thresholds remain 576, 768, 992, 1200, and 1400 pixels. The largest hook is now `blue-2xl-modal`, replacing `blue-xxl-modal`.

## Update Blue's container-query grid markup

`blue-container-grid` remains the wrapper for Blue's container-query grid. Its column classes now use responsive prefixes:

```html
<!-- Before -->
<div class="blue-container-grid">
    <div class="col-md-6">...</div>
</div>

<!-- After -->
<div class="blue-container-grid">
    <div class="md:col-6">...</div>
</div>
```

The width is still evaluated against the container, not the viewport. Update selectors for these classes too; CSS selectors must escape the colon, for example `.md\:col-6`.

## Theme Generator

The documentation site's legacy Theme Generator is unavailable for this alpha. Do not use its old generated stylesheet as the basis for new Blue overrides; configure Blue's Sass entrypoint or override its current CSS tokens instead.
