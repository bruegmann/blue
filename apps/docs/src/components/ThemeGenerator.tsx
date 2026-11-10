import { Palette2 } from "react-bootstrap-icons"
import MenuItem from "blue-react/dist/components/MenuItem"
import { useId, useState } from "react"
import { Button } from "blue-react"

const defaultTokens = {
    base: {
        light: "hsl(217, 17%, 96%)",
        dark: "hsl(217deg 10% 8%)"
    },
    contrast: {
        light: "oklch(0.216 0.0072 245)",
        dark: "white"
    }
} as const

export function ThemeGeneratorSwitch() {
    const id = useId()

    const [tokens, setTokens] = useState({ ...defaultTokens })
    const [css, setCss] = useState("")

    const updateTokens = (updatedTokens: typeof tokens) => {
        setTokens(updatedTokens)
        setCss(/* CSS */ `:root {
            --layout-base: light-dark(${updatedTokens.base.light}, ${updatedTokens.base.dark});
            --layout-bg: light-dark(${updatedTokens.base.light}, ${updatedTokens.base.dark});
            --layout-contrast: light-dark(${updatedTokens.contrast.light}, ${updatedTokens.contrast.dark});
        }`)
    }

    const reset = () => {
        setTokens({ ...defaultTokens })
        setCss("")
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <MenuItem iconBefore={<Palette2 />} label="Theme Generator" labelHidden as="popover-group">
                <div className="p-5" style={{ maxWidth: "24rem" }}>
                    <h2 className="h3">Theme Generator</h2>

                    <div className="grid grid-cols-2 gap-5">
                        {(Object.keys(tokens) as Array<keyof typeof tokens>).map((token) => (
                            <fieldset key={token}>
                                <legend className="h4">{token}</legend>

                                {(Object.keys(tokens[token]) as Array<keyof (typeof tokens)[typeof token]>).map(
                                    (colorMode) => (
                                        <div key={colorMode} className="form-field">
                                            <label htmlFor={`${id}_${token}_${colorMode}`} className="form-label">
                                                {colorMode}
                                            </label>
                                            <input
                                                type="color"
                                                className="form-control"
                                                id={`${id}_${token}_${colorMode}`}
                                                value={tokens[token][colorMode]}
                                                onChange={({ target }) =>
                                                    updateTokens({
                                                        ...tokens,
                                                        [token]: { ...tokens[token], [colorMode]: target.value }
                                                    })
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </fieldset>
                        ))}

                        <Button label="Reset" onClick={reset} className="grid-cols-fill" />
                    </div>
                </div>
            </MenuItem>
        </>
    )
}
