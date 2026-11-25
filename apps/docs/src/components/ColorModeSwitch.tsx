import { createElement, useEffect, useRef, useState } from "react"
import { Check, CircleHalf, MoonStarsFill, SunFill } from "react-bootstrap-icons"
import Menu from "bootstrap/js/dist/menu.js"
import { getPreferred } from "blue-web/src/js/color-mode"

export default function ColorModeSwitch() {
    const [theme, setTheme] = useState(getPreferred())
    const toggleRef = useRef<HTMLButtonElement>(null)
    const instanceRef = useRef<Menu | null>(null)

    useEffect(() => {
        const element = toggleRef.current
        if (!element) return
        const instance = new Menu(element, { placement: "bottom-end" })
        instanceRef.current = instance
        return () => {
            instance.dispose()
            instanceRef.current = null
        }
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme)
        localStorage.setItem("blue-web-color-mode", theme)
        void instanceRef.current?.hide()
    }, [theme])

    return (
        <div>
            <button
                className="btn-subtle theme-secondary"
                type="button"
                ref={toggleRef}
                data-bs-toggle="menu"
                aria-expanded="false"
                aria-label="Choose color mode"
            >
                {createElement(theme === "light" ? SunFill : theme === "dark" ? MoonStarsFill : CircleHalf, {
                    className: "bi"
                })}
            </button>
            <div className="menu" style={{ minWidth: "5rem" }}>
                {(["light", "dark", "auto"] as const).map((mode) => (
                    <button
                        key={mode}
                        type="button"
                        className={`menu-item d-flex align-items-center ${theme === mode ? "active" : ""}`}
                        onClick={() => setTheme(mode)}
                    >
                        {createElement(mode === "light" ? SunFill : mode === "dark" ? MoonStarsFill : CircleHalf, {
                            className: "me-3 opacity-50"
                        })}
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        {theme === mode && <Check className="bi ms-auto" />}
                    </button>
                ))}
            </div>
        </div>
    )
}
