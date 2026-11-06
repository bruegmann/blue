import {
    Children,
    Fragment,
    createContext,
    isValidElement,
    useId,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode
} from "react"
import { TabsContext, type TabsContextValue } from "./TabsContext"

export const TabsNameContext = createContext("")

export interface TabsProps {
    children?: ReactNode
    className?: string
    /**
     * By default, tabs will have styling of Bootstrap `.nav.nav-tabs`.
     * Set this property to `true` to use `.nav.nav-underline` instead.
     */
    underline?: boolean
}

function flattenChildren(children: ReactNode): ReactNode[] {
    return Children.toArray(children).flatMap((child) =>
        isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
            ? flattenChildren(child.props.children)
            : [child]
    )
}

/**
 * Implementation of Bootstrap tabs with React-managed activation.
 * Use together with `Tab`.
 */
export default function Tabs({ children, className, underline }: TabsProps) {
    const tabsId = useId()
    const tabs = flattenChildren(children)
    const initiallyActiveIndex = tabs.findIndex(
        (child) =>
            isValidElement<{ active?: boolean; disabled?: boolean }>(child) &&
            child.props.active &&
            !child.props.disabled
    )
    const firstEnabledIndex = tabs.findIndex(
        (child) => !isValidElement<{ disabled?: boolean }>(child) || !child.props.disabled
    )
    const [activeIndex, setActiveIndex] = useState(initiallyActiveIndex < 0 ? firstEnabledIndex : initiallyActiveIndex)
    const tabListRef = useRef<HTMLUListElement>(null)

    const activate = (index: number) => setActiveIndex(index)
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const tabButtons = Array.from(tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])
        if (tabButtons.length === 0) return

        let nextIndex = index
        switch (event.key) {
            case "ArrowLeft":
                nextIndex = (index - 1 + tabButtons.length) % tabButtons.length
                break
            case "ArrowRight":
                nextIndex = (index + 1) % tabButtons.length
                break
            case "Home":
                nextIndex = 0
                break
            case "End":
                nextIndex = tabButtons.length - 1
                break
            default:
                return
        }

        const direction = event.key === "ArrowLeft" || event.key === "End" ? -1 : 1
        for (let offset = 0; offset < tabButtons.length && tabButtons[nextIndex].disabled; offset++) {
            nextIndex = (nextIndex + direction + tabButtons.length) % tabButtons.length
        }
        if (tabButtons[nextIndex].disabled) return

        event.preventDefault()
        setActiveIndex(nextIndex)
        tabButtons[nextIndex].focus()
    }

    const renderTabs = (mode: TabsContextValue["mode"]) =>
        tabs.map((child, index) => {
            const tabProps = isValidElement<{ label?: string }>(child) ? child.props : null
            if (!tabProps || typeof tabProps.label !== "string") return null

            return (
                <TabsContext.Provider
                    key={`${mode}-${index}`}
                    value={{
                        mode,
                        index,
                        active: activeIndex === index,
                        tabId: `${tabsId}-tab-${index}`,
                        panelId: `${tabsId}-panel-${index}`,
                        activate,
                        handleKeyDown
                    }}
                >
                    {child}
                </TabsContext.Provider>
            )
        })

    return (
        <>
            <ul
                ref={tabListRef}
                role="tablist"
                className={`nav nav-${underline ? "underline" : "tabs"}${className ? ` ${className}` : ""}`}
            >
                {renderTabs("tab")}
            </ul>
            <div className="tab-content">{renderTabs("panel")}</div>
        </>
    )
}
