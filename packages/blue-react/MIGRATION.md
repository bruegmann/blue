# Blue React component migration

This guide covers React component changes made during the Bootstrap 6 alpha migration. It does not cover general Bootstrap markup, utility, or Sass migration. Changes to Blue Web styles are documented in the [Blue Web migration guide](../blue-web/MIGRATION.md).

## Button

### Default styling

With neither `variant` nor `color` set, `Button` now renders only the base `btn` class. It no longer automatically applies `btn-subtle theme-secondary`.

```tsx
// Base button styling
<Button label="Continue" />

// Explicitly retain the previous soft/secondary appearance
<Button variant="soft" color="secondary" label="Continue" />
```

An explicit color without a variant still selects `soft`. An explicit themed variant without a color still selects `secondary`. A `link` without a color remains unthemed; `menu-item` retains Blue's menu-item styling without a theme class.

### Variant and color props

The existing variant prop values remain supported, but the rendered classes no longer depend on Blue's removed soft/plain CSS variants:

| `variant` | Rendered variant class |
| --- | --- |
| `filled` | `btn-solid` |
| `soft` | `btn-subtle` |
| `plain` | `btn-text` |
| `outline` | `btn-outline` |
| `link` | `btn-link` |
| `menu-item` | `blue-menu-item` |

Themed variants compose with `theme-*`. Update any custom selectors that depended on the old combined Blue button class.

`color="accent"` and `color="inverse"` are now supported:

```tsx
<Button color="accent" variant="filled" label="Highlight" />
<Button color="inverse" variant="plain" label="Contrast" />
```

Legacy `light` and `dark` color props remain accepted, but map to `theme-secondary` and `theme-inverse`, respectively. `color="theme"` retains Blue's configured theme through `theme-theme`.

### Rename `square` to `icon`

The `square` prop was removed. Use `icon` instead:

```diff
- <Button square iconBefore={<Gear />} aria-label="Settings" />
+ <Button icon iconBefore={<Gear />} aria-label="Settings" />
```

When `icon` is true, the base class is `btn-icon` **instead of** `btn`. The component no longer adds `blue-btn-square`. Existing variant, color, size, and state props still compose with the icon button.

This is an explicit opt-in; passing `iconBefore` or `iconAfter` does not automatically set `icon`. Give icon-only buttons an accessible name.

The `blue-btn-square` CSS helper has also been removed. Replace manually supplied `btn blue-btn-square` classes with `btn-icon`, or use the Button's `icon` prop. `Layout` toggle buttons and icon-only `MenuItem` collapse summaries now use `btn-icon` internally.

### Opt in to icon hover styling

`iconBefore`, `iconAfter`, and `busy` no longer automatically add `icon-link`. Add both helper classes explicitly when hover styling is desired:

```diff
- <Button iconAfter={<ArrowRight />} className="icon-link-hover" label="Continue" />
+ <Button iconAfter={<ArrowRight />} className="icon-link icon-link-hover" label="Continue" />
```

Icon slots and busy indicators remain supported; this change only removes their automatic helper class.

## Modal and ModalProvider

`Modal`, `ModalProvider`, and `useModal` retain their public names and existing prop/method names. You do not need to rename them to `Dialog`.

- `Modal` now renders one native `<dialog class="dialog blue-modal">`, rather than the old modal wrapper structure. Update component-specific CSS or tests targeting `.modal-dialog`, `.modal-content`, or `.modal-body`.
- DOM lifecycle listeners attached to the rendered component must use `shown.bs.dialog` and `hidden.bs.dialog`, not the old modal event names.
- Direct `Modal` submissions return the entered string, a confirmation boolean, or `null` for cancellation. An accepted empty prompt returns `""`; do not treat it as cancellation with a truthiness check.
- Initialization is client-side, so rendering `Modal` on the server does not import browser-only dialog code.
- Sequential `useModal` requests now wait for dialog transitions, allowing a follow-up message to open after a prompt closes.

These are changes to the component's output and lifecycle, not a new provider API.

## Layout and LayoutSplitter

Existing props and content slots remain unchanged.

- `Layout` renders its sidebar as a native drawer on the dialog itself. The nested `.offcanvas` wrapper and separate backdrop form were removed.
- `LayoutSplitter` makes the equivalent change for its end-side inspector drawer.
- The Blue hooks `blue-modal`, `blue-lg-modal`, `blue-layout-side-body`, and `blue-layout-inspector-body` remain. Update custom descendant selectors to target `.drawer-header` and `.drawer-body` without an intervening offcanvas wrapper.
- Drawer dismissal uses the native dialog rather than `.blue-modal-backdrop`.

If you only use the components' props and slots, no markup rewrite is needed; the components generate the new structure.

## AccordionItem

The public props remain, including native details props such as `name` and `open`.

The header is now a native `summary.accordion-header` containing the header text and an explicit `svg.accordion-icon`. The old `.accordion-button.collapsed` wrapper is gone. `headerButtonClassName` is retained, but is applied to the header text's `span`, not a button-styled wrapper.

Update CSS and DOM tests that target the removed wrapper. Continue using `headerClassName` to style the summary itself.

## HeaderTitle

Existing props remain. Breadcrumb output now includes separate divider elements, and breadcrumb links receive `breadcrumb-link`.

Custom breadcrumb elements supplied to the component are cloned to add that class while retaining their existing `className`. Update selectors or tests that assumed every breadcrumb list item was a content item rather than a divider.

## Other component styling

`Header`, `Status`, and `ToastProvider` now render current theme classes/tokens internally. `Header` no longer sets a background-opacity token for its dropdown background.

`Actions`, `FieldGroup`, `Intro`, and `SlimContainer` also emit updated internal utility classes. Their prop APIs are unchanged. Prefer the components' class-name hooks or your own supplied classes over selecting their internal utility-class combinations.

These migrations do not require rewriting unrelated component props. General changes to Bootstrap classes supplied through `className` are outside this guide's scope.
