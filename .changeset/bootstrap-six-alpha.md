---
"blue-web": major
"blue-react": major
---

Migrate to Bootstrap 6.0.0-alpha.1. Replace Sass import globals with configurable modules and token maps, adopt unprefixed CSS tokens and cascade layers, and update native dialog/drawer, menu, accordion, form, and responsive markup.

Retain Blue's React component API names, including the Button's soft/plain prop values, but remove the custom soft/plain CSS variants in favor of Bootstrap's theme classes with btn-subtle/btn-text. Remove the flattened Sass distribution; the legacy docs Theme Generator is unavailable in this alpha.

Rename the React Button's square prop to icon, using Bootstrap's btn-icon instead of the base btn class.
