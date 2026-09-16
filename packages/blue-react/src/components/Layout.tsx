import React, { ComponentProps, CSSProperties, ReactNode, RefObject, useEffect, useId, useRef } from "react"
import clsx from "clsx"
import { init, dispose } from "blue-web/dist/js/layout.js"
import { getPhrase } from "./shared"

export type LayoutProps = {
    header?: React.ReactNode
    side?: React.ReactNode
    drawerTitle?: ReactNode

    /**
     * For SSR you can pass server's country code to solve hydration problems.
     */
    countryCode?: string
    ref?: RefObject<HTMLDivElement | null>
} & ComponentProps<"div">

/**
 * A layout with header, side and main content area. Side is collapsible.
 */
export default function Layout({
    children,
    className,
    header,
    side,
    drawerTitle,
    countryCode,
    ref,
    ...props
}: LayoutProps) {
    const divRef = ref || useRef<HTMLDivElement>(null)

    const idPrefix = useId()
    const sideId = `${idPrefix}side`
    const drawerId = `${idPrefix}drawer`
    const drawerLabelId = `${idPrefix}drawerLabel`

    useEffect(() => {
        if (divRef.current) {
            init(divRef.current)
        }

        return () => {
            if (divRef.current) {
                dispose(divRef.current)
            }
        }
    }, [])

    return (
        <div ref={divRef} className={clsx("blue-layout", className)} {...props}>
            <header className="blue-layout-header">
                <button
                    type="button"
                    className="btn blue-menu-item blue-btn-square d-flex d-lg-none"
                    /* @ts-ignore */
                    command="show-modal"
                    commandfor={drawerId}
                    aria-label={getPhrase("Toggle menu", countryCode)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-layout-sidebar-inset"
                    >
                        <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"></path>
                        <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"></path>
                    </svg>
                </button>

                <button
                    type="button"
                    className="btn blue-menu-item blue-btn-square d-none d-lg-flex"
                    data-blue-toggle="layout-side"
                    aria-controls={sideId}
                    aria-expanded="true"
                    aria-label={getPhrase("Toggle sidebar", countryCode)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-layout-sidebar"
                    >
                        <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z"></path>
                    </svg>
                </button>

                {header}
            </header>

            <div id={sideId} className="blue-layout-side">
                <dialog className="blue-lg-modal blue-modal modal" id={drawerId} aria-describedby={drawerLabelId}>
                    <div className="offcanvas offcanvas-start">
                        <div className="offcanvas-header">
                            <h1 className="h5 offcanvas-title" id={drawerLabelId}>
                                {drawerTitle || getPhrase("Menu", countryCode)}
                            </h1>
                            <form method="dialog" style={{ display: "contents" }}>
                                <button
                                    type="submit"
                                    className="btn-close"
                                    aria-label={getPhrase("Close", countryCode)}
                                ></button>
                            </form>
                        </div>
                        <div className="offcanvas-body">
                            <div className="blue-layout-side-body">{side}</div>
                        </div>
                    </div>
                    <form method="dialog" className="blue-modal-backdrop">
                        <button>{getPhrase("Close", countryCode)}</button>
                    </form>
                </dialog>
            </div>

            <main className="blue-layout-main">{children}</main>
        </div>
    )
}
