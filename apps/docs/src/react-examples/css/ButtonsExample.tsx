import { useId, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { synthwave84 as syntaxHighlighterStyle } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function ButtonsExample({ variant }: { variant: string }) {
    const [disabled, setDisabled] = useState(false)
    const [active, setActive] = useState(false)

    const colors = ["primary", "secondary", "success", "danger", "warning", "info", "accent", "inverse"]

    const id = useId()

    return (
        <>
            <div className="mb-5 d-flex gap-5">
                <div className="form-field">
                    <div className="switch">
                        <input
                            type="checkbox"
                            role="switch"
                            id={`${id}-disabled-switch`}
                            checked={disabled}
                            onChange={() => {
                                setDisabled(!disabled)
                            }}
                        />
                    </div>
                    <label className="form-label" htmlFor={`${id}-disabled-switch`}>
                        Disabled
                    </label>
                </div>

                <div className="form-field">
                    <div className="switch">
                        <input
                            type="checkbox"
                            role="switch"
                            id={`${id}-active-switch`}
                            checked={active}
                            onChange={() => {
                                setActive(!active)
                            }}
                        />
                    </div>
                    <label className="form-label" htmlFor={`${id}-active-switch`}>
                        Active
                    </label>
                </div>
            </div>

            <div className="d-flex gap-5 mb-5">
                {colors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        className={`btn blue-btn-${variant}-${color}${active ? " active" : ""}`}
                        disabled={disabled}
                    >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                ))}
            </div>

            <SyntaxHighlighter style={syntaxHighlighterStyle} language="html">
                {colors
                    .map(
                        (color) =>
                            `<button type="button" className="btn blue-btn-${variant}-${color}${
                                active ? " active" : ""
                            }"${disabled ? " disabled" : ""}>${color.charAt(0).toUpperCase() + color.slice(1)}</button>`
                    )
                    .join("\n")}
            </SyntaxHighlighter>
        </>
    )
}
