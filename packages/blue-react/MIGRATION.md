# Blue React component migration

This guide covers React component changes made during the Bootstrap 6 alpha migration. It does not cover general Bootstrap markup, utility, or Sass migration. Changes to Blue Web styles are documented in the [Blue Web migration guide](../blue-web/MIGRATION.md).

## Button

### Variant and theme props

Rename the `color` prop to `theme`, and update the variant values:

| Previous `variant` | Migration |
| --- | --- |
| `filled` | `solid` |
| `soft` | `subtle` |
| `plain` | `text` |
| `outline` | Keep `outline` |
| `link` | Keep `link` |
| `menu-item` | Use `MenuItem` instead |

The variant classes are now `btn-solid`, `btn-outline`, `btn-subtle`, `btn-text`, and `btn-link`. A `theme` prop adds the corresponding `theme-*` class. `theme="accent"` and `theme="inverse"` are supported:

```tsx
<Button theme="accent" variant="solid" label="Highlight" />
<Button theme="inverse" variant="text" label="Contrast" />
```

`light` and `dark` are still accepted theme values, but now produce `theme-light` and `theme-dark`. To preserve the old `color="light"` or `color="dark"` appearance, use `theme="secondary"` or `theme="inverse"`, respectively.

With neither `variant` nor `theme`, `Button` now renders the base `btn` class only; it no longer defaults to the soft secondary styling. A theme without a variant adds `theme-*`, `btn`, and `btn-subtle`. Explicit non-link variants render only their matching `btn-*` class, without the base `btn`; `link` renders `btn btn-link`. Add an explicit theme and variant to preserve the old appearance:

```tsx
// Base Bootstrap button
<Button label="Continue" />

// Previous soft/secondary appearance
<Button variant="subtle" theme="secondary" label="Continue" />
```

Use the `MenuItem` component instead of `Button variant="menu-item"`. It now composes `variant="solid"` with the `blue-menu-item` class.

### Rename `square` to `icon`

The `square` prop was removed. Use `icon` instead:

```diff
- <Button square iconBefore={<Gear />} aria-label="Settings" />
+ <Button icon iconBefore={<Gear />} aria-label="Settings" />
```

`icon` adds `btn-icon`; whether `btn` is also present follows the variant behavior described above. The component no longer adds `blue-btn-square`. Existing variant, theme, size, and state props still compose with the icon button.

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

## Tabs

`Tabs` and `Tab` keep their existing exports and props. They now render a Bootstrap tab list (`ul.nav.nav-tabs` or `ul.nav.nav-underline`) with buttons and separate `.tab-content` / `.tab-pane` panels instead of radio inputs with Blue-specific classes.

Tab activation is managed by React and does not require Bootstrap's JavaScript tab plugin. `active` selects the initial tab; when none is marked active, the first tab is selected. Keyboard users can move between tabs with the arrow keys, Home, and End.

The `className` on `Tab` is still applied to its tab control, and `contentClassName` remains on the panel. Custom CSS targeting `.blue-tabs`, `.blue-tab`, or `.blue-tab-content` should be updated to target the Bootstrap nav and tab classes instead.

## Layout and LayoutSplitter

Existing props and content slots remain unchanged.

- `Layout` now adds the Bootstrap theme classes `theme-layout theme-contrast` to its root element. Update custom selectors or overrides that assumed Blue's previous `theme-theme` styling.
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

## Search

The public Search props remain unchanged. Its inner wrapper now uses `form-control form-adorn` instead of `blue-input-group input-group`; the icon label uses `form-adorn-icon`, and the input uses `form-ghost`. Pill rounding and `noRounding` remain supported.

Update custom CSS and DOM tests targeting the removed input-group classes. `inputClassName` is still applied to the input, not the wrapper. If you supply a custom input through `children`, give it `form-ghost` rather than `form-control` so it shares the wrapper's border and focus ring.

The reset button now sits directly in the adorned wrapper as `btn-icon btn-text`; the intermediate `.input-group-btn` element has been removed. Reset behavior and callbacks are unchanged.

## Other component styling

`Header`, `Status`, and `ToastProvider` now render current theme classes/tokens internally. `Header` no longer sets a background-opacity token for its dropdown background.

`ActionMenu` is deprecated, and Blue Web no longer supplies the responsive styles for its legacy action-menu classes. Migrate to `Actions`; the old component's markup may remain, but its previous responsive presentation will not.

`Actions`, `FieldGroup`, `Intro`, and `SlimContainer` also emit updated internal utility classes. Their prop APIs are unchanged. Prefer the components' class-name hooks or your own supplied classes over selecting their internal utility-class combinations.

These migrations do not require rewriting unrelated component props. General changes to Bootstrap classes supplied through `className` are outside this guide's scope.
