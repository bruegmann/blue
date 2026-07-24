import { useId, type ReactNode, createContext, useContext } from "react"

const TabsNameContext = createContext("")

export interface TabsProps {
    children?: ReactNode
    className?: string
    /**
     * By default, tabs will have styling of Bootstrap `.nav.nav-tabs`.
     * Set this property to `true` to use `.nav.nav-underline` instead.
     */
    underline?: boolean
}
export function Tabs({ children, className, underline }: TabsProps) {
    const tabsName = "TabList-" + useId()
    return (
        <div role="tablist" className={`blue-tabs nav nav-${underline ? "underline" : "tabs"} ${className}`}>
            <TabsNameContext.Provider value={tabsName}>{children}</TabsNameContext.Provider>
        </div>
    )
}

export interface TabProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    children?: ReactNode
    className?: string
    contentClassName?: string
    active?: boolean
}
export function Tab({ label, children, className, contentClassName, active, ...rest }: TabProps) {
    const tabsName = useContext(TabsNameContext)
    const tabId = "Tab_" + useId()
    const tabPanelId = "Tab_Panel_" + useId()

    return (
        <>
            <input
                type="radio"
                name={tabsName}
                role="tab"
                id={tabId}
                aria-label={label}
                aria-controls={tabPanelId}
                className={`blue-tab nav-link ${className}`}
                defaultChecked={active}
                {...rest}
            />
            <div
                role="tabpanel"
                id={tabPanelId}
                aria-labelledby={tabId}
                tabIndex={0}
                className={`blue-tab-content ${contentClassName}`}
            >
                {children}
            </div>
        </>
    )
}
