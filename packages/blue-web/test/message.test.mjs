import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import vm from "node:vm"
import ts from "typescript"

function setup() {
    const source = readFileSync(new URL("../src/js/message.ts", import.meta.url), "utf8")
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
    })
    const elements = new Map()
    const pendingCloses = []
    class Dialog extends EventTarget {
        open = false
        form = new EventTarget()
        input = { value: "" }
        constructor(id) {
            super()
            this.id = id
        }
        querySelector(selector) {
            return selector === "input" ? this.input : this.form
        }
        showModal() {
            this.open = true
        }
        close() {
            this.open = false
            pendingCloses.push(() => this.dispatchEvent(new Event("close")))
        }
        remove() {
            if (elements.get(this.id) === this) elements.delete(this.id)
        }
        submit() {
            this.form.dispatchEvent(new Event("submit", { cancelable: true }))
        }
    }
    let markup
    const context = {
        exports: {},
        window: {},
        HTMLDialogElement: Dialog,
        document: {
            getElementById: (id) => elements.get(id),
            body: {
                insertAdjacentHTML(_position, html) {
                    markup = html
                    const id = html.match(/\bid="([^"]+)"/)[1]
                    elements.set(id, new Dialog(id))
                }
            }
        },
        require(id) {
            if (id === "./utils.js") return { guid: () => "test-message" }
            if (id === "./shared.js") return { getPhrase: (phrase) => phrase }
            throw new Error(`Unexpected dependency: ${id}`)
        }
    }
    vm.runInNewContext(outputText, context)
    return {
        ...context.exports,
        window: context.window,
        elements,
        flushCloses: () => pendingCloses.splice(0).forEach((close) => close()),
        markup: () => markup
    }
}

test("message API is exposed without the old dialog namespace", () => {
    const { window } = setup()
    assert.deepEqual(Object.keys(window.blueWeb.message), ["ask", "tell", "verify"])
    assert.equal("dialog" in window.blueWeb, false)
})

test("prompt acceptance preserves empty and non-empty strings", async () => {
    const { ask, elements, markup } = setup()
    for (const value of ["", "password"]) {
        const result = ask("Question")
        const dialog = elements.get("test-message")
        assert.equal(dialog.open, true)
        assert.match(markup(), /<dialog class="blue-modal dialog"/)
        assert.doesNotMatch(markup(), /modal-content|modal-dialog/)
        dialog.input.value = value
        dialog.submit()
        assert.equal(await result, value)
        assert.equal(elements.size, 0)
    }
})

test("native close resolves cancellation and removes the dialog", async () => {
    const { ask, elements, flushCloses } = setup()
    const result = ask("Question")
    elements.get("test-message").close()
    flushCloses()
    assert.equal(await result, false)
    assert.equal(elements.size, 0)
})

test("confirmation acceptance resolves true", async () => {
    const { verify, elements } = setup()
    const result = verify("Confirm")
    elements.get("test-message").submit()
    assert.equal(await result, true)
})

test("dialog action buttons use Bootstrap's text and solid variants", async () => {
    const { verify, elements, markup } = setup()
    for (const switchPrimaryBtn of [false, true]) {
        const result = verify("Confirm", { switchPrimaryBtn })
        assert.match(markup(), new RegExp(`class="btn theme-primary ${switchPrimaryBtn ? "btn-solid" : "btn-text"}"`))
        assert.match(markup(), new RegExp(`class="btn theme-primary ${switchPrimaryBtn ? "btn-text" : "btn-solid"}"`))
        assert.doesNotMatch(markup(), /blue-btn-(?:soft|plain)-/)
        elements.get("test-message").submit()
        assert.equal(await result, true)
    }
})

test("a delayed close event cannot remove a subsequent dialog reusing its ID", async () => {
    const { ask, elements, flushCloses } = setup()
    const first = ask("First", { id: "reused" })
    elements.get("reused").submit()
    assert.equal(await first, "")
    const second = ask("Second", { id: "reused" })
    const replacement = elements.get("reused")
    flushCloses()
    assert.equal(elements.get("reused"), replacement)
    assert.equal(replacement.open, true)
    replacement.input.value = "second"
    replacement.submit()
    assert.equal(await second, "second")
})

test("invalid existing dialog markup rejects rather than hanging", async () => {
    const { ask, elements } = setup()
    elements.set("invalid", {})
    await assert.rejects(ask("Question", { id: "invalid" }), /must be a native dialog element/)
    const result = ask("Valid")
    const dialog = elements.get("test-message")
    dialog.input = null
    await assert.rejects(ask("Invalid", { id: "test-message" }), /missing its form or prompt input/)
    dialog.close()
    dialog.dispatchEvent(new Event("close"))
    assert.equal(await result, false)
})
