import "blue-themify"
import { type CSSProperties, type FC, useEffect, useState } from "react"
import Code from "./Code.tsx"
import { BoxArrowInDown, Braces, Palette2 } from "react-bootstrap-icons"
import { Tab, Tabs } from "$/components/Tabs.tsx"
import MenuItem from "blue-react/dist/components/MenuItem"

export interface ThemeInfoAppSettingsTemplateConfig {
    repo: string
    branch: string
    file: string
}

export interface ThemeInfo {
    name: string
    account?: string
    link?: string
    customStyle?: string
    variables: { [variable: string]: string }
    blueReactVersion?: string
    blueWebVersion?: string
    appSettings: { [key: string]: string }
    appSettingsTemplateUrl?: string
    appSettingsTemplateConfig?: ThemeInfoAppSettingsTemplateConfig
    exportOnlyCssVars: boolean
    includeNeuScss: boolean
    colorMode?: "light" | "dark"
    appearance?: "soft" | "bold"
    rounding?: "none" | "minimal" | "default" | "maximal"
    useSquircles?: boolean
}

type CompileEvent = CustomEvent<{ css: string; themeInfo: ThemeInfo }>

export function applyTheme(theme: { css: string; themeInfo: ThemeInfo }) {
    const docsInlineStyle = document.querySelector<HTMLStyleElement>("#docs-inline-style")
    if (docsInlineStyle) {
        docsInlineStyle.innerHTML = theme.css
    }
    document.documentElement.setAttribute("data-bs-theme", theme.themeInfo.colorMode || "light")
}

const ThemifyAppearanceHelperWrapper = "themify-appearance-helper-wrapper" as unknown as FC<{
    themeInfo?: ThemeInfo
    blueWebScssSrc?: string
    oncompile?: (e: CompileEvent) => void
    applyOnMount?: boolean
}>

export function ThemeGeneratorSwitch() {
    const [show, setShow] = useState(false)
    const [defaultTheme, setDefaultTheme] = useState<{ themeInfo: ThemeInfo; css: string }>()

    const action = () => {
        setShow(true)
    }

    useEffect(() => {
        const fromStorage = localStorage.getItem("themeGenerator_theme")
        if (fromStorage) {
            const theme = JSON.parse(fromStorage)
            setDefaultTheme(theme)
        }
    }, [])

    return (
        <MenuItem onClick={action} iconBefore={<Palette2 />} label="Theme Generator" labelHidden as="popover-group">
            <div className="p-2">{show && <ThemeGenerator defaultThemeInfo={defaultTheme?.themeInfo} />}</div>
        </MenuItem>
    )
}

interface ThemeGeneratorProps {
    defaultThemeInfo?: ThemeInfo
}

const DEFAULT_THEME_INFO: ThemeInfo = {
    name: "My theme",
    variables: {
        $theme: "hsl(210deg 100% 94%)",
        $primary: "hsl(210deg 100% 50%)",
        $white: "#fff",
        "$gray-100": "hsl(210deg 17% 98%)",
        "$gray-200": "hsl(210deg 16% 93%)",
        "$gray-300": "hsl(210deg 14% 89%)",
        "$gray-400": "hsl(210deg 14% 83%)",
        "$gray-500": "hsl(210deg 11% 71%)",
        "$gray-600": "hsl(210deg 7% 46%)",
        "$gray-700": "hsl(210deg 9% 31%)",
        "$gray-800": "hsl(210deg 10% 23%)",
        "$gray-900": "hsl(210deg 11% 15%)",
        $black: "#000",
        "$header-color": "$gray-900",
        "$sidebar-color": "$gray-900"
    },
    appSettings: {},
    exportOnlyCssVars: true,
    includeNeuScss: false,
    colorMode: "light",
    appearance: "soft",
    blueWebVersion: "latest"
}

export default function ThemeGenerator({ defaultThemeInfo }: ThemeGeneratorProps) {
    const [css, setCss] = useState("")
    const [scss, setScss] = useState("")
    const [themeInfo, setThemeInfo] = useState<ThemeInfo | null>(defaultThemeInfo || DEFAULT_THEME_INFO)
    const [themeInfoImportCode, setThemeInfoImportCode] = useState("")

    const handleCompile = ({ detail }: CompileEvent) => {
        applyTheme(detail)
        setCss(detail.css)

        let scss = "// Blue variables\n//\n\n"
        if (detail.themeInfo.variables) {
            Object.keys(detail.themeInfo.variables).forEach((i: string) => {
                if (detail.themeInfo.variables[i] !== "") scss += i + ": " + detail.themeInfo.variables[i] + ";\n"
            })
        }
        setScss(scss)
        setThemeInfo(detail.themeInfo)
        localStorage.setItem("themeGenerator_theme", JSON.stringify(detail))
    }

    const reset = () => {
        const themeInfo = { ...DEFAULT_THEME_INFO }
        setThemeInfo(themeInfo)
        applyTheme({ themeInfo, css: "" })
        localStorage.removeItem("themeGenerator_theme")
    }

    return (
        <>
            <style>{
                /* CSS */ `:root {
	--primary-hs: 210 100%;
	--danger-hs: 345 90%;
	--success-hs: 137 57%;

	--l-0: 0%;
	--l-10: 10%;
	--l-30: 30%;
	--l-40: 40%;
	--l-50: 50%;
	--l-60: 60%;
	--l-80: 80%;
	--l-90: 90%;
	--l-95: 95%;
	--l-100: 100%;

	--shadow-color: 0deg 0% 0%;
	--shadow-elevation-low: 0.2px 0.6px 0.7px hsl(var(--shadow-color) / 0.13),
		0.7px 2px 2.3px -2.8px hsl(var(--shadow-color) / 0.12);
	--shadow-elevation-medium: 0.2px 0.6px 0.7px hsl(var(--shadow-color) / 0.13),
		0.9px 2.5px 2.8px -1.4px hsl(var(--shadow-color) / 0.12),
		3.7px 10px 11.4px -2.8px hsl(var(--shadow-color) / 0.11);
	--shadow-elevation-high: 0.2px 0.6px 0.7px hsl(var(--shadow-color) / 0.12),
		1.2px 3.1px 3.6px -0.6px hsl(var(--shadow-color) / 0.11),
		2.5px 6.6px 7.6px -1.1px hsl(var(--shadow-color) / 0.11),
		4.9px 13.2px 15.1px -1.7px hsl(var(--shadow-color) / 0.1),
		9.2px 24.8px 28.4px -2.3px hsl(var(--shadow-color) / 0.1),
		16.1px 43.5px 49.7px -2.8px hsl(var(--shadow-color) / 0.09);

	--focus-shadow: inset 0 0 0 1px hsl(var(--primary-hs) var(--l-40));

	display: contents;
}

[data-bs-theme="dark"],
[data-themify-theme="dark"] {
	--l-0: 100%;
	--l-10: 98%;
	--l-30: 78%;
	--l-40: 68%;
	--l-60: 48%;
	--l-80: 28%;
	--l-90: 18%;
	--l-95: 13%;
	--l-100: 8%;
}

@media (prefers-color-scheme: dark) {
	[data-themify-theme="media-query"] {
		--l-0: 100%;
		--l-10: 98%;
		--l-30: 78%;
		--l-40: 68%;
		--l-60: 48%;
		--l-80: 28%;
		--l-90: 18%;
		--l-95: 13%;
		--l-100: 8%;
	}
}`
            }</style>

            <div className="ms-auto d-flex gap-1 mb-3" role="toolbar" aria-label="Theme generator controls">
                <button
                    type="button"
                    className="btn blue-btn-soft-primary btn-sm icon-link icon-link-hover"
                    style={{ "--bs-icon-link-transform": "rotate(-5deg) scale(1.1)" } as CSSProperties}
                    onClick={() =>
                        document.querySelector<HTMLDialogElement>("#ThemeGenerator_outputModal")?.showModal()
                    }
                >
                    <Braces className="bi" />
                    Show output
                </button>

                <button
                    type="button"
                    className="btn blue-btn-plain-primary btn-sm icon-link icon-link-hover"
                    style={{ "--bs-icon-link-transform": "rotate(5deg) scale(1.1)" } as CSSProperties}
                    onClick={() =>
                        document.querySelector<HTMLDialogElement>("#ThemeGenerator_importModal")?.showModal()
                    }
                >
                    <BoxArrowInDown className="bi" />
                    Import
                </button>
            </div>

            {themeInfo && (
                <ThemifyAppearanceHelperWrapper
                    themeInfo={themeInfo}
                    blueWebScssSrc={import.meta.env.BASE_URL + "/merged.scss"}
                    oncompile={handleCompile}
                    applyOnMount
                />
            )}

            <button type="button" className="btn blue-btn-soft-primary btn-sm mt-3" onClick={reset}>
                Reset
            </button>

            <dialog className="blue-modal modal" id="ThemeGenerator_outputModal">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Embed this to your page</h1>
                            <form method="dialog" style={{ display: "contents" }}>
                                <button type="submit" className="btn-close" aria-label="Close"></button>
                            </form>
                        </div>
                        <div className="modal-body">
                            <Tabs>
                                <Tab label="Theme info" active>
                                    <p className="p-3 pb-0">
                                        Configuration for this theme. You should save it to make changes to your theme
                                        later.
                                    </p>
                                    <Code code={JSON.stringify(themeInfo, null, 4)} language="json" />
                                </Tab>

                                <Tab label="CSS">
                                    <p className="p-3 pb-0">
                                        This CSS only contains all CSS variables. This allows you to change the look
                                        without running a Sass compiler. Especially useful if you want to change the
                                        theme while the page is running. CSS has to be embedded after the Blue Web CSS.
                                    </p>
                                    <Code code={css} language="css" />
                                </Tab>

                                <Tab label="SCSS variables">
                                    <p className="p-3 pb-0">
                                        Set these variables in your SCSS file before you import the Blue Web SCSS file.
                                    </p>
                                    <Code code={scss} language="scss" />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>

                <form method="dialog" className="blue-modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>

            <dialog className="blue-modal modal" id="ThemeGenerator_importModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Import your theme info config</h1>
                            <form method="dialog" style={{ display: "contents" }}>
                                <button type="submit" className="btn-close" aria-label="Close"></button>
                            </form>
                        </div>
                        <form
                            method="dialog"
                            style={{ display: "contents" }}
                            onSubmit={(e) => {
                                setThemeInfo(null)
                                setTimeout(() => {
                                    setThemeInfo(JSON.parse(themeInfoImportCode))
                                }, 200)
                            }}
                        >
                            <div className="modal-body">
                                <div className="form-floating">
                                    <textarea
                                        className="form-control"
                                        placeholder="Paste your theme info code here"
                                        id="ThemeGenerator_importInput"
                                        style={{ height: "100px" }}
                                        value={themeInfoImportCode}
                                        onChange={(e) => setThemeInfoImportCode(e.target.value)}
                                    ></textarea>
                                    <label htmlFor="ThemeGenerator_importInput">Theme info code</label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">
                                    Import
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <form method="dialog" className="blue-modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    )
}
