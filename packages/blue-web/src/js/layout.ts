import { init as mrInit, dispose as mrDispose } from "./modal-responsive.js"

type WaSplitterPanelBaseType = HTMLElement & {
    disabled?: boolean
    position?: number
}

export type Instance = {
    toggleLayoutSideEl: Element | null
    layoutSideEl: Element | null
    modalEl: HTMLDialogElement | null
    splitterEl: WaSplitterPanelBaseType | null
    toggleInspectorEl: HTMLElement | null
    toggleInspectorEventListener: (() => void) | null
    inspectorEl: HTMLDialogElement | null
    controller: AbortController
}

const instances = new Map<HTMLElement, Instance>()

export function init(layoutEl: HTMLElement) {
    if (!layoutEl) return

    if (instances.has(layoutEl)) {
        dispose(layoutEl)
    }

    const toggleLayoutSideEl = layoutEl.querySelector('[data-blue-toggle="layout-side"]')
    const layoutSideEl = layoutEl.querySelector(".blue-layout-side")
    const modalEl = layoutEl.querySelector<HTMLDialogElement>(".blue-layout-side > dialog")
    const splitterEl = layoutEl.querySelector<WaSplitterPanelBaseType>(
        ".blue-layout-main > wa-split-panel.blue-layout-splitter"
    )
    const toggleInspectorEl = layoutEl.querySelector<HTMLElement>('[data-blue-toggle="layout-inspector"]')
    const inspectorEl = layoutEl.querySelector<HTMLDialogElement>(".blue-layout-inspector")

    if (!toggleLayoutSideEl || !layoutSideEl || !modalEl) return
    const controller = new AbortController()
    const instance = {
        toggleLayoutSideEl,
        layoutSideEl,
        modalEl,
        splitterEl,
        toggleInspectorEl,
        toggleInspectorEventListener: () => toggleInspector(layoutEl),
        inspectorEl,
        controller
    }

    instances.set(layoutEl, instance)

    const entry = localStorage.getItem("blueLayoutSideShrink")
    const shrink = entry != null
    if (shrink) {
        layoutSideEl.classList.add("d-lg-none", "w-lg-0")
        toggleLayoutSideEl.setAttribute("aria-expanded", "false")
    }

    toggleLayoutSideEl.addEventListener("click", () => toggleSidebar(layoutEl), { signal: controller.signal })

    if (splitterEl && toggleInspectorEl && inspectorEl) {
        toggleInspectorEl.addEventListener("click", instance.toggleInspectorEventListener, {
            signal: controller.signal
        })
        mrInit(inspectorEl)
        initInspector(layoutEl)
    }

    mrInit(modalEl)
    layoutSideEl.classList.add("with-transition")
}

export function dispose(layoutEl: HTMLElement) {
    const instance = instances.get(layoutEl)
    if (!instance) return
    const { controller, modalEl } = instance

    controller.abort()
    if (modalEl) mrDispose(modalEl)

    instances.delete(layoutEl)
}

function toggleSidebar(layoutEl: HTMLElement) {
    const instance = instances.get(layoutEl)
    if (!instance) return
    const { layoutSideEl, toggleLayoutSideEl } = instance
    if (!layoutSideEl || !toggleLayoutSideEl) return

    layoutSideEl.classList.toggle("d-lg-none")
    layoutSideEl.classList.toggle("w-lg-0")
    const expanded = !layoutSideEl.classList.contains("d-lg-none")
    toggleLayoutSideEl.setAttribute("aria-expanded", expanded.toString())
    if (expanded) {
        localStorage.removeItem("blueLayoutSideShrink")
    } else {
        localStorage.setItem("blueLayoutSideShrink", "")
    }
}

function initInspector(layoutEl: HTMLElement) {
    const instance = instances.get(layoutEl)
    if (!instance) return
    const { splitterEl, inspectorEl, controller } = instance
    if (!splitterEl || !inspectorEl || !controller) return

    const entry = localStorage.getItem("blueLayoutInspectorEnabled")
    const enabled = entry != null

    if (enabled && getComputedStyle(inspectorEl).position !== "fixed") {
        splitterEl.disabled = false
    }

    window.addEventListener(
        "resize",
        () => {
            if (splitterEl && inspectorEl && getComputedStyle(inspectorEl).display === "none") {
                splitterEl.disabled = true
                splitterEl.position = 0
            }
        },
        { signal: controller.signal }
    )
}

export function toggleInspector(
    layoutTarget: HTMLElement | string,
    showCommand: "show-modal" | "show" | undefined = "show-modal"
) {
    console.log("toggleInspector")
    console.log(layoutTarget, showCommand)

    let layoutEl: HTMLElement | null = layoutTarget as HTMLElement
    if (typeof layoutTarget === "string" || layoutTarget instanceof String) {
        layoutEl = document.querySelector(layoutTarget as string)
    }

    console.log(layoutEl)

    if (!layoutEl) return

    const instance = instances.get(layoutEl)
    if (!instance) return
    const { splitterEl, toggleInspectorEl, inspectorEl } = instance
    if (!splitterEl || !inspectorEl) return

    if (getComputedStyle(inspectorEl).position === "fixed") {
        // Is active as dialog
        if (inspectorEl.open) {
            inspectorEl.close()
        } else {
            if (showCommand === "show" || toggleInspectorEl?.dataset.blueShowCommand === "show") {
                inspectorEl.show()
            } else {
                inspectorEl.showModal()
            }
        }
    } else {
        if (splitterEl.disabled) {
            splitterEl.disabled = false
            localStorage.setItem("blueLayoutInspectorEnabled", "")
        } else {
            splitterEl.disabled = true
            splitterEl.position = 0
            localStorage.removeItem("blueLayoutInspectorEnabled")
        }
    }
}

if (typeof window !== "undefined") {
    window.blueWeb = window.blueWeb || {}
    window.blueWeb.layout = { init, dispose, instances, toggleInspector }
}
