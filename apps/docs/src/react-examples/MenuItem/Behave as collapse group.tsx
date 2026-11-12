import { DropletFill } from "react-bootstrap-icons"
import { MenuItem } from "blue-react"

export default function AsCollapseGroupExample() {
    return (
        <>
            <MenuItem iconBefore={<DropletFill />} label="Parent" as="collapse-group">
                <MenuItem label="Parent's Child 1" />
                <MenuItem label="Child 2" />
                <MenuItem label="Parent" as="collapse-group">
                    <MenuItem label="Child 1" />
                    <MenuItem label="Child 2" />
                </MenuItem>
                <MenuItem label="Child 4" />
            </MenuItem>
            <MenuItem iconBefore={<DropletFill />} label="Parent" as="collapse-group">
                <MenuItem label="Child 1" />
                <MenuItem label="Child 2" />
            </MenuItem>
        </>
    )
}
