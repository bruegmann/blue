import WaSplitPanel from "@awesome.me/webawesome/dist/react/split-panel/index.js"
import { ComponentProps, ReactNode, useId } from "react"
import clsx from "clsx"
import LayoutBody from "./LayoutBody"
import { getPhrase } from "./shared"

/**
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
    primary = "end",
    position = 0,
    disabled = true,
    className,
    ...props
}: Omit<ComponentProps<typeof WaSplitPanel>, "children"> & {
    inspectorId?: string
    start?: ReactNode
    end?: ReactNode
    drawerTitle?: ReactNode
    noPageBorder?: boolean

    /**
     * For SSR you can pass server's country code to solve hydration problems.
     */
    countryCode?: string
}) {
    const idPrefix = useId()
    const drawerLabelId = `${idPrefix}drawerLabel`

    return (
        <WaSplitPanel
            primary={primary}
            position={position}
            disabled={disabled}
            className={clsx("blue-layout-splitter", className)}
            {...props}
        >
            <LayoutBody
                slot="start"
                className={clsx({
                    "border-0": noPageBorder
                })}
            >
                {start}
            </LayoutBody>

            <div
                slot="divider"
                className="border"
                style={{
                    height: "16px",
                    borderRadius: "1px"
                }}
            />

            <dialog
                slot="end"
                className="blue-layout-inspector blue-lg-modal blue-modal modal"
                id={inspectorId}
                aria-describedby={drawerLabelId}
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
                    <div className="offcanvas-body">{end}</div>
                </div>
                <form method="dialog" className="blue-modal-backdrop">
                    <button>{getPhrase("Close", countryCode)}</button>
                </form>
            </dialog>
        </WaSplitPanel>
    )
}
