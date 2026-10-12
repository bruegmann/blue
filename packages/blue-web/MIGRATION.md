# Blue Web style migration

This guide covers Blue Web's style changes made during the Bootstrap 6 alpha migration. It is not a general Bootstrap migration guide. React component changes are documented separately in the [Blue React migration guide](../blue-react/MIGRATION.md).

## Configure Blue through its Sass entrypoint

Blue's stylesheet no longer reads configuration from global Sass variables. Configure it once through `@use ... with`:

```scss
// Before
$theme: orange;
$bla-sidebar-width: 20rem;
@import "blue-web/dist/style";
```

```scss
// After
@use "blue-web/dist/style" with (
    $theme: orange,
    $theme-dark: #102030,
    $bla-sidebar-width: 20rem
);
```

Blue's settings are forwarded through this entrypoint. See [the public defaults](dist/styles/_bootstrap-variables.scss) and [Blue-specific variables](dist/styles/_variables.scss) for available configuration.

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

Blue's existing `--blue-*` tokens remain available. Adaptive root colors now use `light-dark()`, and tokens are emitted on both `:root` and `:host`. Configure the paired light/dark Sass settings, or override the Blue token directly:

```css
:root {
    --blue-sidebar-bg: light-dark(#f5f5f5, #202020);
}
```

The old `--theme` fallback no longer controls `--blue-theme`. Override `--blue-theme` directly, or configure `$theme` and `$theme-dark`.

Blue now supplies its Inter font stack through `--blue-font-family`. The default body font references that token; an explicitly configured body font is no longer overwritten by Blue's Inter styles.

Blue's compiled stylesheet and source Sass both use unprefixed base tokens. Do not add Bootstrap's separately compiled, prefixed stylesheet alongside Blue's CSS. For custom overrides of Blue elements, use the token names consumed by the current Blue source rather than assuming `--bs-*` aliases exist.

## Replace Blue's CSS-only tabs

Blue's `.blue-tabs`, `.blue-tab`, and `.blue-tab-content` styles have been removed. The `--blue-tabs-underline-active-font-weight` custom property is also no longer used. Use Bootstrap's `.nav.nav-tabs` or `.nav.nav-underline`, `.nav-link`, and `.tab-content` / `.tab-pane` classes instead. For standalone HTML tabs, follow Bootstrap's tab markup and load its JavaScript plugin to activate the buttons.

Blue React's `Tabs` and `Tab` components keep their public props and manage tab activation in React, so they do not require Bootstrap's JavaScript plugin. Update custom CSS selectors that target the removed Blue tab classes.

## Replace removed Blue button variants

Blue no longer defines the `blue-btn-soft-*` or `blue-btn-plain-*` classes.

| Removed Blue class | Replacement |
| --- | --- |
| `blue-btn-soft-primary` | `theme-primary btn-subtle` |
| `blue-btn-plain-primary` | `theme-primary btn-text` |
| `blue-btn-soft-light` | `theme-secondary btn-subtle` |
| `blue-btn-plain-light` | `theme-secondary btn-text` |
| `blue-btn-soft-dark` | `theme-inverse btn-subtle` |
| `blue-btn-plain-dark` | `theme-inverse btn-text` |
| `blue-btn-soft-theme` | `theme-theme btn-subtle` |
| `blue-btn-plain-theme` | `theme-theme btn-text` |

Apply the same replacement to other color suffixes, such as `success`, `danger`, `warning`, and `info`. Replace custom selectors targeting the removed classes as well as markup.

`theme-theme` remains a Blue-specific theme class backed by `--blue-theme` and Blue's sidebar foreground colors. The button variants themselves are no longer supplied by Blue.

Blue's `blue-btn-icon-wrapper` helper remains available. The `blue-btn-square` CSS helper has been removed. Replace `btn blue-btn-square` with `btn-icon` for icon-only buttons, retaining an accessible name. React consumers should use the Button's `icon` prop.

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
<dialog
    class="blue-modal blue-lg-modal drawer drawer-start"
    aria-labelledby="navigation-title"
    closedby="any"
>
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
