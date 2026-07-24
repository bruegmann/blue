import { Actions } from "blue-react"
import { HeaderTitle } from "blue-react"
import { MenuItem } from "blue-react"
import { SimpleLayout } from "blue-react"

export default function InsideLayoutHeaderDemo() {
    return (
        <div
            style={{
                background: "var(--blue-app-bg)",
                width: "400px"
            }}
        >
            <SimpleLayout
                header={
                    <>
                        <HeaderTitle>My page</HeaderTitle>

                        <Actions>
                            <MenuItem label="Child 1" icon={<>🌍</>} />
                            <MenuItem label="Child 2" icon={<>🌑</>} />
                            <MenuItem label="Child 3" icon={<>☀️</>} />
                            <MenuItem label="Child 4" icon={<>🚀</>} />
                            <MenuItem label="Child 5" icon={<>🌌</>} />
                        </Actions>
                    </>
                }
                style={{ height: "400px" }}
            />
        </div>
    )
}
