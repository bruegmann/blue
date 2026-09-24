import "@spectrum-web-components/split-view/sp-split-view.js"
import { ComponentProps, ReactNode, useId } from "react"
import clsx from "clsx"
import { getPhrase } from "./shared"

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "sp-split-view": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                vertical?: boolean
                resizable?: boolean
                collapsible?: boolean
                label?: string
                "primary-size"?: string
                "primary-min"?: string
                "primary-max"?: string
                "secondary-min"?: string
                "secondary-max"?: string
                "splitter-pos"?: string
            }
        }
    }
}

export type LayoutSplitterProps = Omit<ComponentProps<"sp-split-view">, "children"> & {
    inspectorId?: string
    start?: ReactNode
    end?: ReactNode
    drawerTitle?: ReactNode
    noPageBorder?: boolean

    /**
     * For SSR you can pass server's country code to solve hydration problems.
     */
    countryCode?: string
}

/**
 * Might require React 19 or higher!
 * Allows to create a split view between the layout's main content and an inspector next to it.
 * Doesn't support SSR out of the box.
 */
export default function LayoutSplitter({
    inspectorId,
    start,
    end,
    drawerTitle,
    noPageBorder,
    countryCode,
    className,
    ...props
}: LayoutSplitterProps) {
    const idPrefix = useId()
    const drawerLabelId = `${idPrefix}drawerLabel`

    return (
        <sp-split-view className={clsx("blue-layout-splitter", className)} {...props}>
            <div>
                <div
                    className={clsx("blue-layout-body", {
                        "border-0": noPageBorder
                    })}
                >
                    {start}
                </div>
            </div>

            <div>
                <dialog
                    className="blue-layout-inspector blue-lg-modal blue-modal modal"
                    id={inspectorId}
                    aria-labelledby={drawerLabelId}
                >
                    <div className="offcanvas offcanvas-end">
                        <div className="offcanvas-header">
                            <h1 className="h5 offcanvas-title" id={drawerLabelId}>
                                {drawerTitle || getPhrase("Inspector", countryCode)}
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
                            <div className="blue-layout-inspector-body">{end}</div>
                        </div>
                    </div>
                    <form method="dialog" className="blue-modal-backdrop">
                        <button>{getPhrase("Close", countryCode)}</button>
                    </form>
                </dialog>
            </div>
        </sp-split-view>
    )
}
