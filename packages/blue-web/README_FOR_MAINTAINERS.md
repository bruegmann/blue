# Create new release

Build from the workspace root with `pnpm --filter blue-web build-release`.
Sass sources are maintained in `dist/style.scss` and `dist/styles`; they are not generated files.
Bootstrap 6 requires Sass modules and a modern Dart Sass compiler. Do not flatten modules into `merged.scss`.
Use `pnpm --filter blue-web test` to check default/custom Sass compilation and migration regressions.
The workspace uses `pnpm-lock.yaml`; the obsolete package-local npm lockfiles have been removed.

```
npm version patch   # or minor / major
```
