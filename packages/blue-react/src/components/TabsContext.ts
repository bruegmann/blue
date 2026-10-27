import { createContext, type KeyboardEvent } from "react"

export type TabsContextValue = {
    mode: "tab" | "panel"
    index: number
    active: boolean
    tabId: string
    panelId: string
    activate: (index: number) => void
    handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
}

export const TabsContext = createContext<TabsContextValue | null>(null)
