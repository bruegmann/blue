const instances = new Map<HTMLDialogElement, AbortController>()
let originalPushState: History["pushState"] | undefined
let originalReplaceState: History["replaceState"] | undefined
let wrappedPushState: History["pushState"] | undefined
let wrappedReplaceState: History["replaceState"] | undefined

function closeDialogs() {
    for (const dialog of instances.keys()) {
        if (dialog.open) dialog.close()
    }
}

export function init(modalEl: HTMLDialogElement) {
    if (!modalEl) return

    if (instances.has(modalEl)) {
        dispose(modalEl)
    }

    const controller = new AbortController()

    instances.set(modalEl, controller)

    window.addEventListener(
        "popstate",
        () => {
            if (modalEl.open) modalEl.close()
        },
        { signal: controller.signal }
    )
    window.addEventListener(
        "resize",
        () => {
            if (modalEl.open && getComputedStyle(modalEl).position !== "fixed") {
                modalEl?.close()
            }
        },
        { signal: controller.signal }
    )

    if (!originalPushState || !originalReplaceState) {
        const pushState = history.pushState
        const replaceState = history.replaceState
        originalPushState = pushState
        originalReplaceState = replaceState
        wrappedPushState = function (this: History, ...args) {
            pushState.apply(this, args)
            closeDialogs()
        }
        wrappedReplaceState = function (this: History, ...args) {
            replaceState.apply(this, args)
            closeDialogs()
        }
        history.pushState = wrappedPushState
        history.replaceState = wrappedReplaceState
    }
}

export function dispose(modalEl: HTMLDialogElement) {
    const controller = instances.get(modalEl)
    if (!controller) return

    controller.abort()
    instances.delete(modalEl)

    if (instances.size === 0) {
        if (history.pushState === wrappedPushState && originalPushState) history.pushState = originalPushState
        if (history.replaceState === wrappedReplaceState && originalReplaceState)
            history.replaceState = originalReplaceState
        originalPushState = undefined
        originalReplaceState = undefined
        wrappedPushState = undefined
        wrappedReplaceState = undefined
    }
}

if (typeof window !== "undefined") {
    window.blueWeb = window.blueWeb || {}
    window.blueWeb.modalResponsive = { init, dispose }
}
