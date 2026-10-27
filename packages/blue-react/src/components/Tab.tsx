import { useContext, type KeyboardEvent, type MouseEvent, type ReactNode } from "react"
import { TabsContext } from "./TabsContext"

export interface TabProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    children?: ReactNode
    className?: string
    contentClassName?: string
    active?: boolean
}

/**
 * Always use together with `Tabs`.
 */
export default function Tab({
    label,
    children,
    className,
    contentClassName,
    active: _active,
    onClick,
    onKeyDown,
    ...rest
}: TabProps) {
    const tabs = useContext(TabsContext)
    if (!tabs) throw new Error("Tab must be rendered inside Tabs.")
    const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>

    if (tabs.mode === "tab") {
        return (
            <li className="nav-item" role="presentation">
                <button
                    {...buttonProps}
                    type="button"
                    id={tabs.tabId}
                    role="tab"
                    aria-controls={tabs.panelId}
                    aria-selected={tabs.active}
                    tabIndex={tabs.active ? 0 : -1}
                    className={`nav-link${tabs.active ? " active" : ""}${className ? ` ${className}` : ""}`}
                    onClick={(event) => {
                        onClick?.(event as MouseEvent<HTMLInputElement>)
                        if (!event.defaultPrevented) tabs.activate(tabs.index)
                    }}
                    onKeyDown={(event) => {
                        onKeyDown?.(event as KeyboardEvent<HTMLInputElement>)
                        if (!event.defaultPrevented) tabs.handleKeyDown(event, tabs.index)
                    }}
                >
                    {label}
                </button>
            </li>
        )
    }

    return (
        <div
            role="tabpanel"
            id={tabs.panelId}
            aria-labelledby={tabs.tabId}
            tabIndex={0}
            hidden={!tabs.active}
            className={`tab-pane${tabs.active ? " active" : ""}${contentClassName ? ` ${contentClassName}` : ""}`}
        >
            {children}
        </div>
    )
}
