import { MenuItem } from "blue-react"
import { SidebarMenu } from "blue-react"
import { IconMenuItem } from "blue-react"
import { BoxArrowLeft, Gear, List, Person } from "react-bootstrap-icons"

export default function IconMenuItemExample() {
    return (
        <div className="bg-primary position-relative">
            <SidebarMenu
                sidebarClass="position-static shadow-none overflow-visible"
                menuClass="overflow-visible"
                bottomContent={
                    <div className="d-flex flex-wrap">
                        <IconMenuItem
                            href="#record"
                            outerClass="flex-fill"
                            label="User settings"
                            icon={<Person className="bi" />}
                        />

                        <IconMenuItem href="#" outerClass="flex-fill" label="Settings" icon={<Gear className="bi" />} />

                        <IconMenuItem
                            href="#"
                            outerClass="flex-fill"
                            label="Sign out"
                            icon={<BoxArrowLeft className="bi" />}
                        />
                    </div>
                }
            >
                <MenuItem
                    icon={<List className="bi" />}
                    label="Toggle menu"
                    onClick={() => {
                        window.blueHashRouterRef.setState({
                            expandSidebar: !window.blueHashRouterRef.state.expandSidebar
                        })
                    }}
                />

                <MenuItem icon={<span>😅</span>} label="Hello World" />
                <MenuItem icon={<span style={{ transform: "scale(-1, 1)" }}>👀</span>} label="Another normal item" />
            </SidebarMenu>
        </div>
    )
}
