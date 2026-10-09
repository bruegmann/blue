import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Button from "../dist/components/Button.js"
import AccordionItem from "../dist/components/AccordionItem.js"
import Modal from "../dist/components/Modal.js"

test("existing Button variant props render Bootstrap 6 variant/theme composition", () => {
    for (const [variant, expected] of [
        ["filled", "solid"],
        ["soft", "subtle"],
        ["plain", "text"],
        ["outline", "outline"]
    ]) {
        const html = renderToStaticMarkup(createElement(Button, { variant, color: "primary", label: "Action" }))
        assert.match(html, new RegExp(`btn-${expected} theme-primary`))
        assert.doesNotMatch(html, /btn-primary|btn-outline-primary/)
    }
})

test("legacy light/dark button colors map to available v6 themes", () => {
    const light = renderToStaticMarkup(createElement(Button, { color: "light", label: "Light" }))
    const dark = renderToStaticMarkup(createElement(Button, { color: "dark", label: "Dark" }))
    assert.match(light, /theme-secondary/)
    assert.match(dark, /theme-inverse/)
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
