import { Palette2 } from "react-bootstrap-icons"
import MenuItem from "blue-react/dist/components/MenuItem"

export function ThemeGeneratorSwitch() {
    return (
        <MenuItem iconBefore={<Palette2 />} label="Theme Generator" labelHidden as="popover-group">
            <div className="p-5" style={{ maxWidth: "24rem" }}>
                <h2 className="h5">Theme Generator unavailable in this alpha</h2>
                <p className="mb-0">
                    The legacy generator compiles Bootstrap 5 Sass and cannot load Bootstrap 6 modules. Customize CSS
                    tokens at runtime, or configure Blue with Sass <code>@use … with</code>. See the customization guide
                    on the home page.
                </p>
            </div>
        </MenuItem>
    )
}
