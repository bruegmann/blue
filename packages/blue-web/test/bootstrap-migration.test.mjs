import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"
import * as sass from "sass"

const root = fileURLToPath(new URL("../", import.meta.url))
const options = { loadPaths: [root, path.join(root, "node_modules")], style: "expanded" }
const compile = (source) => sass.compileString(source, options).css

test("default stylesheet emits Bootstrap 6 and Blue once, in ordered layers", () => {
    const css = compile('@use "dist/style";')
    assert.match(
        css,
        /@layer colors, config, root, reboot, layout, content, forms, components, custom, helpers, utilities;/
    )
    assert.equal((css.match(/@layer custom \{/g) || []).length, 1)
    assert.match(css, /--primary-base: var\(--blue-500\)/)
    assert.match(css, /--blue-500: hsl\(221, 97%, 53%\)/)
    assert.match(css, /--radius-5: 0.7rem/)
    assert.match(css, /\.lg\\:d-none/)
    assert.match(css, /\.lg\\:w-0/)
    assert.match(css, /@media \(width >= 992px\)/)
    assert.match(css, /@container \(width >= 768px\)/)
    assert.match(css, /\.blue-modal\.blue-lg-modal/)
    assert.match(css, /\.btn-subtle\s*\{/)
    assert.match(css, /\.btn-text\s*\{/)
    assert.match(css, /\.theme-primary\s*\{/)
    assert.match(css, /\.theme-theme\s*\{/)
    assert.doesNotMatch(css, /\.blue-btn-(?:soft|plain)-/)
    assert.match(css, /\.btn-icon\s*\{/)
    assert.doesNotMatch(css, /\.blue-btn-square/)
    assert.match(css, /\.form-adorn\s*\{/)
    assert.match(css, /\.form-ghost\s*\{/)
    assert.doesNotMatch(css, /\.blue-input-group/)
    assert.match(css, /--blue-app-bg: light-dark\(/)
    assert.doesNotMatch(
        css,
        /--bs-|var\(--box-shadow-md\)|var\(--(?:body|primary|secondary)[\w-]*-rgb\)|\.modal-content|\.accordion-button/
    )
})

test("entrypoint configuration reaches Bootstrap and every Blue partial", () => {
    const css = compile(`
        @use "dist/style" with (
            $primary: tomato,
            $theme: orange,
            $theme-dark: #102030,
            $radius: 1rem,
            $bla-sidebar-width: 20rem,
            $root-tokens: (--focus-ring-width: 4px, --body-font-family: serif),
            $accordion-tokens: (--accordion-padding-x: 2rem),
            $utilities: ("width": (property: width, responsive: true, class: w, values: (0: 0, 100: 100%)))
        );
    `)
    assert.match(css, /--blue-500: tomato/)
    assert.match(css, /--blue-theme: light-dark\(orange, #102030\)/)
    assert.match(css, /--blue-sidebar-width: 20rem/)
    assert.match(css, /--radius-5: 1rem/)
    assert.match(css, /--focus-ring-width: 4px/)
    assert.match(css, /--body-font-family: serif/)
    assert.equal((css.match(/--body-font-family:/g) || []).length, 1)
    assert.match(css, /--accordion-padding-x: 2rem/)
    assert.match(css, /--accordion-padding-y: 0.75rem/)
    assert.match(css, /--body-line-height: 1.5/)
    assert.match(css, /\.lg\\:w-0/)
    assert.doesNotMatch(css, /\.w-25\s*\{/)
})

test("Blue mixins are usable through module namespaces", () => {
    const css = compile(`
        @use "dist/style" as blue;
        .example {
            @include blue.blue-layout-body(var(--bg-body));
            @include blue.switch();
        }
    `)
    assert.match(css, /color-mix\(in srgb, var\(--fg-body\) 50%, transparent\)/)
    assert.match(css, /color: var\(--fg-body\)/)
})

test("maintained Sass no longer depends on import globals", () => {
    const visit = (dir) =>
        readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
            entry.isDirectory() ? visit(path.join(dir, entry.name)) : [path.join(dir, entry.name)]
        )
    for (const file of visit(path.join(root, "dist", "styles")).filter((file) => file.endsWith(".scss"))) {
        assert.doesNotMatch(
            readFileSync(file, "utf8"),
            /@import|--bs-|--#\{\$prefix\}|@include (?:rfs|button-variant)\(/,
            file
        )
    }
})
