import { default as Button, type ButtonVariant, type ButtonColor } from "blue-react/dist/components/Button"
import { createContext, useContext, useId, useRef, useState, type CSSProperties, type FC, type ReactNode } from "react"
import { CheckLg, ChevronDown, Search } from "react-bootstrap-icons"
import clsx from "clsx"

const BlSelectList = "bl-select-list" as unknown as FC<{
    class?: string
    style?: CSSProperties
    id?: string
    for?: string
    children?: ReactNode
    "active-class"?: string
    "onbl-select"?: (event: { index: number; item: HTMLElement }) => void
}>

const SelectedContext = createContext("")
const SearchContext = createContext("")

const t = {
    de: {
        Select: "Auswählen",
        Selected: "Ausgewählt",
        NothingSelected: "Nichts ausgewählt",
        Search: "Suchen",
        NoItemsFound: "Keine Einträge gefunden."
    },
    en: {
        Select: "Select",
        Selected: "Selected",
        NothingSelected: "Nothing selected",
        Search: "Search",
        NoItemsFound: "No items found."
    }
}[navigator.language.startsWith("de") ? "de" : "en"]

export function ComboboxOptionGroup({
    label,
    children,
    className,
    style
}: {
    label: string
    children?: ReactNode
    className?: string
    style?: CSSProperties
}) {
    return (
        <div role="group" aria-label={label} className={clsx("blue-scrollspy-group", className)} style={style}>
            <div className="list-group-item fw-medium small text-primary-emphasis" style={{ border: 0 }}>
                {label}
            </div>
            {children}
        </div>
    )
}

export function ComboboxOption({
    value,
    description,
    children,
    className,
    style
}: {
    value: string
    description?: string
    children?: ReactNode
    className?: string
    style?: CSSProperties
}) {
    const selected = useContext(SelectedContext)
    const search = useContext(SearchContext)
    if (
        !value.toLowerCase().includes(search.toLowerCase()) &&
        !description?.toLowerCase().includes(search.toLowerCase())
    )
        return null

    const isThisSelected = selected === (value || children)

    return (
        <button
            className={clsx("list-group-item list-group-item-action d-flex align-items-baseline", className)}
            type="button"
            style={{ border: "0", ...style }}
            data-value={value}
            data-description={description}
            data-selected={isThisSelected ? "" : undefined}
        >
            {children || description || value}
            {!children && description && <span className="ms-2 opacity-75 small">{value}</span>}

            {isThisSelected && (
                <span className="ms-auto">
                    <CheckLg aria-hidden="true" />
                    <span className="visually-hidden">{t.Selected}</span>
                </span>
            )}
        </button>
    )
}

export function Combobox({
    children,
    value,
    id,
    description,
    onChange,
    variant,
    color,
    className,
    style,
    popoverEnd,
    labelHidden,
    scrollspy,
    selectListMaxHeight = "400px"
}: {
    children?: ReactNode
    value?: string
    id?: string
    description?: string
    onChange?: (value: string, description?: string) => void
    variant?: ButtonVariant
    color?: ButtonColor
    className?: string
    style?: CSSProperties
    popoverEnd?: boolean
    labelHidden?: boolean
    scrollspy?: boolean
    selectListMaxHeight?: string
}) {
    const [search, setSearch] = useState("")
    const [selectedValue, setSelectedValue] = useState("")
    const [selectedDescription, setSelectedDescription] = useState<string>()

    const inputRef = useRef<HTMLInputElement>(null)
    const inputId = useId()
    const popoverRef = useRef<HTMLDivElement>(null)
    const popoverId = useId()
    const listboxId = useId()

    const currentValue = value === undefined ? selectedValue : value
    const currentDescription = description === undefined ? selectedDescription : description
    const currentDisplay = (currentDescription || currentValue).trim()

    return (
        <>
            <Button
                id={id}
                label={currentDisplay || `${t.Select}...`}
                labelHidden={labelHidden}
                iconAfter={<ChevronDown />}
                popoverTarget={popoverId}
                variant={variant}
                color={color}
                aria-haspopup="listbox"
                className={className}
                style={style}
            >
                <span className="visually-hidden">
                    {currentDisplay ? `${t.Selected}: ${currentDisplay}` : t.NothingSelected}
                </span>
            </Button>

            <div
                ref={popoverRef}
                id={popoverId}
                popover=""
                onToggle={(e) => {
                    if (e.newState === "open") {
                        inputRef.current?.focus()
                        popoverRef.current?.querySelector("[data-selected]")?.scrollIntoView({ block: "center" })
                    }
                }}
                className={clsx("blue-anchored blue-anchored-fallback border rounded-bottom-4 shadow bg-body mt-1", {
                    "blue-anchored-end": popoverEnd
                })}
                style={{ borderRadius: "calc(var(--bs-border-radius-xl) + .5rem)" }}
            >
                <div className="m-1">
                    <div className="blue-input-group input-group rounded-pill">
                        <label htmlFor={inputId} className="input-group-text">
                            <Search />
                            <span className="visually-hidden">{t.Search}</span>
                        </label>
                        <input
                            ref={inputRef}
                            type="search"
                            className="form-control"
                            id={inputId}
                            placeholder={`${t.Search}...`}
                            autoComplete="off"
                            value={search}
                            onChange={({ target }) => setSearch(target.value)}
                            aria-autocomplete="list"
                        />
                    </div>
                </div>

                <BlSelectList
                    class={clsx("blue-empty-message list-group list-group-flush overflow-auto", {
                        "blue-scrollspy": scrollspy
                    })}
                    style={
                        {
                            "--message": `"${t.NoItemsFound}"`,
                            maxHeight: selectListMaxHeight,
                            "--blue-scrollspy-marker-group-padding-inline": ".25rem",
                            "--blue-scrollspy-marker-group-gap": ".25rem"
                        } as CSSProperties
                    }
                    active-class={`bg-${color || "primary"}-subtle text-${color || "primary"}-emphasis`}
                    id={listboxId}
                    for={inputId}
                    onbl-select={({ item }) => {
                        const value = item.dataset.value || item.innerText
                        const description = item.dataset.description
                        setSelectedValue(value)
                        setSelectedDescription(description)
                        onChange?.(value, description)
                        popoverRef.current?.hidePopover()
                    }}
                >
                    <SelectedContext value={currentValue}>
                        <SearchContext value={search}>{children}</SearchContext>
                    </SelectedContext>
                </BlSelectList>
            </div>
        </>
    )
}
