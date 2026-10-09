import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Button from "../dist/components/Button.js"
import AccordionItem from "../dist/components/AccordionItem.js"
import Modal from "../dist/components/Modal.js"
import MenuItem from "../dist/components/MenuItem.js"

test("existing Button variant props render Bootstrap 6 variant/theme composition", () => {
    for (const [variant, expected] of [
        ["filled", "solid"],
        ["soft", "subtle"],
        ["plain", "text"],
        ["outline", "outline"]
    ]) {
        const html = renderToStaticMarkup(createElement(Button, { variant, color: "primary", label: "Action" }))
        assert.match(html, new RegExp(`btn-${expected} theme-primary`))
        assert.doesNotMatch(html, /btn-primary|btn-outline-primary|blue-btn-(?:soft|plain)-/)
    }
})

test("soft/plain buttons use native variants for every supported color", () => {
    for (const color of [
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
        "accent",
        "inverse",
        "theme"
    ]) {
        for (const [variant, native] of [
            ["soft", "subtle"],
            ["plain", "text"]
        ]) {
            const html = renderToStaticMarkup(
                createElement(Button, { variant, color, sm: true, disabled: true, label: "Action" })
            )
            assert.match(html, new RegExp(`btn-${native} theme-${color}`))
            assert.match(html, /btn-sm/)
            assert.match(html, /disabled=""/)
            assert.doesNotMatch(html, /blue-btn-(?:soft|plain)-/)
        }
    }
})

test("default buttons use only the base class while explicit styling is preserved", () => {
    const render = (props) => renderToStaticMarkup(createElement(Button, { label: "Action", ...props }))
    assert.match(render({}), /class="btn"/)
    assert.match(render({ icon: true }), /class="btn-icon"/)
    assert.match(render({ variant: "soft" }), /btn-subtle theme-secondary/)
    assert.match(render({ color: "primary" }), /btn-subtle theme-primary/)
    assert.match(render({ variant: "plain" }), /btn-text theme-secondary/)
    assert.doesNotMatch(render({ variant: "link" }), /theme-/)
    assert.match(render({ variant: "link", color: "primary" }), /btn-link theme-primary/)
    assert.match(render({ variant: "menu-item", color: "primary" }), /blue-menu-item/)
    assert.doesNotMatch(render({ variant: "menu-item", color: "primary" }), /theme-|btn-subtle|btn-text/)
})

test("accent and inverse colors compose with every themed Button variant", () => {
    for (const color of ["accent", "inverse"]) {
        for (const [variant, native] of [
            ["filled", "solid"],
            ["soft", "subtle"],
            ["plain", "text"],
            ["outline", "outline"],
            ["link", "link"]
        ]) {
            const html = renderToStaticMarkup(createElement(Button, { variant, color, label: color }))
            assert.match(html, new RegExp(`btn-${native} theme-${color}`))
        }
    }
})

test("legacy light/dark button colors map to available v6 themes", () => {
    const light = renderToStaticMarkup(createElement(Button, { color: "light", label: "Light" }))
    const dark = renderToStaticMarkup(createElement(Button, { color: "dark", label: "Dark" }))
    assert.match(light, /theme-secondary/)
    assert.match(dark, /theme-inverse/)
})

test("icon buttons replace the base btn class without forwarding the icon prop", () => {
    for (const elementType of ["button", "a"]) {
        for (const icon of [true, false, undefined]) {
            const html = renderToStaticMarkup(
                createElement(Button, {
                    elementType,
                    icon,
                    variant: "plain",
                    color: "accent",
                    sm: true,
                    active: true,
                    className: "custom",
                    "aria-label": "Settings",
                    iconBefore: createElement("svg")
                })
            )
            const classes = html.match(/class="([^"]+)"/)[1].split(" ")
            assert.equal(classes.includes("btn-icon"), icon === true)
            assert.equal(classes.includes("btn"), icon !== true)
            for (const name of ["btn-text", "theme-accent", "btn-sm", "active", "custom"]) {
                assert.ok(classes.includes(name))
            }
            assert.match(html, /aria-label="Settings"/)
            assert.doesNotMatch(html, /blue-btn-square| icon=| square=/)
        }
    }
})

test("icon-link styling is opt-in for icons and busy indicators", () => {
    for (const props of [
        { iconBefore: createElement("svg") },
        { iconAfter: createElement("svg") },
        { busy: true },
        { icon: true, iconBefore: createElement("svg") }
    ]) {
        const html = renderToStaticMarkup(createElement(Button, { label: "Action", ...props }))
        assert.doesNotMatch(html.match(/class="([^"]+)"/)[1], /\bicon-link\b/)
        const explicit = renderToStaticMarkup(
            createElement(Button, { label: "Action", ...props, className: "icon-link icon-link-hover" })
        )
        assert.match(explicit.match(/class="([^"]+)"/)[1], /\bicon-link icon-link-hover\b/)
    }
})

test("MenuItem collapse-group uses btn-icon for its icon-only summary", () => {
    const html = renderToStaticMarkup(
        createElement(MenuItem, { as: "collapse-group", label: "Group" }, "Content")
    )
    const classes = html.match(/<summary[^>]*class="([^"]+)"/)[1].split(" ")
    assert.ok(classes.includes("btn-icon"))
    assert.equal(classes.includes("btn"), false)
    assert.doesNotMatch(html, /blue-btn-square/)
})

test("AccordionItem retains details props and renders the v6 summary and icon", () => {
    const html = renderToStaticMarkup(
        createElement(AccordionItem, { header: "Section", name: "group", open: true }, "Body")
    )
    assert.match(html, /<details[^>]*name="group"[^>]*open=""/)
    assert.match(html, /<summary class="accordion-header">/)
    assert.match(html, /class="accordion-icon"/)
    assert.doesNotMatch(html, /accordion-button|collapsed|data-bs-toggle/)
})

test("Modal keeps its API while rendering one native dialog without v5 wrappers", () => {
    const html = renderToStaticMarkup(
        createElement(Modal, { type: "ask", unSetModalContent() {}, modalContent: "Prompt" })
    )
    assert.match(html, /<dialog class="dialog blue-modal"/)
    assert.match(html, /aria-labelledby=/)
    assert.match(html, /btn-solid/)
    assert.doesNotMatch(html, /modal-dialog|modal-content|modal-body/)
})
