import AsCollapseGroupExample from "$/react-examples/MenuItem/Behave as collapse group"

/**
 * Menu Item is using Bootstrap's Button component class names. You can use the Theme utility classes to change to look of Menu Items.
 */
export default function ThemingMenuItemsDemo() {
    return (
        <div className="vstack gap-5">
            <div className="theme-layout theme-contrast">
                <h4 className="px-5 py-4">Layout theme</h4>
                <AsCollapseGroupExample />
            </div>
            <div className="theme-primary theme-contrast">
                <h4 className="px-5 py-4">Primary theme</h4>
                <AsCollapseGroupExample />
            </div>
            <div className="theme-secondary theme-contrast">
                <h4 className="px-5 py-4">Secondary theme</h4>
                <AsCollapseGroupExample />
            </div>
            <div className="theme-inverse theme-contrast">
                <h4 className="px-5 py-4">Inverse theme</h4>
                <AsCollapseGroupExample />
            </div>
        </div>
    )
}
