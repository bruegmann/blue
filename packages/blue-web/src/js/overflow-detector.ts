export interface OverflowObserverOptions {
    element: HTMLElement
    onChange: (isOverflowing: boolean, element: HTMLElement) => void
}

interface ObservedEntry {
    element: HTMLElement
    onChange: (isOverflowing: boolean, element: HTMLElement) => void
    wasOverflowing: boolean
}

export class OverflowDetector {
    private resizeObserver: ResizeObserver | null = null
    private entries = new Map<HTMLElement, ObservedEntry>()

    constructor() {
        if ("ResizeObserver" in window) {
            this.resizeObserver = new ResizeObserver((resizeEntries) => {
                for (const resizeEntry of resizeEntries) {
                    const element = resizeEntry.target as HTMLElement
                    const entry = this.entries.get(element)
                    if (entry) {
                        this.check(entry)
                    }
                }
            })
        }
    }

    private check(entry: ObservedEntry) {
        const isOverflowing = entry.element.scrollWidth > entry.element.clientWidth + 1
        if (isOverflowing !== entry.wasOverflowing) {
            entry.wasOverflowing = isOverflowing
            entry.onChange(isOverflowing, entry.element)
        }
    }

    observe(options: OverflowObserverOptions) {
        const { element, onChange } = options

        if (this.entries.has(element)) {
            this.unobserve(element)
        }

        const entry: ObservedEntry = {
            element,
            onChange,
            wasOverflowing: false
        }

        this.entries.set(element, entry)
        this.resizeObserver?.observe(element)

        this.check(entry)
    }

    unobserve(element: HTMLElement) {
        this.resizeObserver?.unobserve(element)
        this.entries.delete(element)
    }

    checkAll() {
        this.entries.forEach((entry) => {
            this.check(entry)
        })
    }

    destroy() {
        this.resizeObserver?.disconnect()
        this.resizeObserver = null
        this.entries.clear()
    }
}

export function isOverflowing(element: HTMLElement): boolean {
    return element.scrollWidth > element.clientWidth + 1
}

window.blueWeb = window.blueWeb || {}
window.blueWeb.OverflowDetector = OverflowDetector
window.blueWeb.isOverflowing = isOverflowing
