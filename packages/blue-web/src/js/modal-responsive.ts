const instances = new Map()

export function init(modalEl: HTMLDialogElement) {
    if (!modalEl) return

    if (instances.has(modalEl)) {
        dispose(modalEl)
    }

    const offcanvasEl = modalEl.querySelector(".offcanvas")

    if (!offcanvasEl) return
    const controller = new AbortController()

    instances.set(modalEl, controller)

    window.addEventListener("popstate", () => modalEl?.close(), { signal: controller.signal })
    window.addEventListener(
        "resize",
        () => {
            const offcanvasEl = modalEl.querySelector(".offcanvas")
            if (offcanvasEl && getComputedStyle(offcanvasEl).position !== "fixed") {
                modalEl?.close()
            }
        },
        { signal: controller.signal }
    )

    const originalPushState = history.pushState
    history.pushState = function (...args) {
        originalPushState.apply(history, args)
        modalEl?.close()
    }

    const originalReplaceState = history.replaceState
    history.replaceState = function (...args) {
        originalReplaceState.apply(history, args)
        modalEl?.close()
    }
}

export function dispose(modalEl: HTMLDialogElement) {
    const controller = instances.get(modalEl)
    if (!controller) return

    controller.abort()
    instances.delete(modalEl)
}

if (typeof window !== "undefined") {
    window.blueWeb = window.blueWeb || {}
    window.blueWeb.modalResponsive = { init, dispose }
}
