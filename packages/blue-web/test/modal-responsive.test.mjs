import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import vm from "node:vm"
import ts from "typescript"

function setup() {
    const source = readFileSync(new URL("../src/js/modal-responsive.ts", import.meta.url), "utf8")
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
    })
    const window = new EventTarget()
    const history = {
        pushState() {
            assert.equal(this, history)
        },
        replaceState() {
            assert.equal(this, history)
        }
    }
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    const context = {
        exports: {},
        window,
        history,
        AbortController,
        getComputedStyle: (dialog) => ({ position: dialog.position })
    }
    vm.runInNewContext(outputText, context)
    const dialog = () => ({
        open: true,
        position: "fixed",
        closed: 0,
        close() {
            this.open = false
            this.closed++
        }
    })
    return { ...context.exports, window, history, originalPushState, originalReplaceState, dialog }
}

test("resize reads the native drawer itself and closes only above its breakpoint", () => {
    const { init, dispose, window, dialog } = setup()
    const drawer = dialog()
    init(drawer)
    window.dispatchEvent(new Event("resize"))
    assert.equal(drawer.open, true)
    drawer.position = "static"
    window.dispatchEvent(new Event("resize"))
    assert.equal(drawer.open, false)
    assert.equal(drawer.closed, 1)
    dispose(drawer)
})

test("navigation closes all registered drawers and disposal restores history methods", () => {
    const { init, dispose, history, originalPushState, originalReplaceState, dialog } = setup()
    const first = dialog()
    const second = dialog()
    init(first)
    const wrapper = history.pushState
    init(second)
    assert.equal(history.pushState, wrapper)
    history.pushState({}, "", "#next")
    assert.equal(first.open, false)
    assert.equal(second.open, false)
    dispose(first)
    assert.equal(history.pushState, wrapper)
    second.open = true
    history.replaceState({}, "", "#replacement")
    assert.equal(second.closed, 2)
    dispose(second)
    assert.equal(history.pushState, originalPushState)
    assert.equal(history.replaceState, originalReplaceState)
})

test("reinitialization and disposal do not leave duplicate window listeners", () => {
    const { init, dispose, window, dialog } = setup()
    const drawer = dialog()
    init(drawer)
    init(drawer)
    window.dispatchEvent(new Event("popstate"))
    assert.equal(drawer.closed, 1)
    dispose(drawer)
    drawer.open = true
    window.dispatchEvent(new Event("popstate"))
    assert.equal(drawer.open, true)
})
