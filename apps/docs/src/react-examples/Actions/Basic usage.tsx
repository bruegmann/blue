import { useState } from "react"
import { Actions } from "blue-react"
import { MenuItem } from "blue-react"
import { EmojiHeartEyesFill } from "react-bootstrap-icons"

export default function BasicUsageExample() {
    const [width, setWidth] = useState(392)

    return (
        <>
            <div className="border" style={{ width: `${width}px` }}>
                <Actions>
                    <MenuItem label="Child 1" icon={<>🌍</>} />
                    <MenuItem label="Child 2" icon={<>🌑</>} />
                    <MenuItem label="Child 3" icon={<>☀️</>} />
                    <MenuItem label="Child 4" icon={<>🚀</>} />
                    <MenuItem label="Child 5" icon={<>🌌</>} />

                    <MenuItem icon={<EmojiHeartEyesFill />} label="John Boy">
                        <MenuItem icon={<EmojiHeartEyesFill />} label="I am a child item" />
                    </MenuItem>
                </Actions>
            </div>

            <label className="mt-3">
                <span className="form-label">Change width</span>
                <input
                    type="range"
                    className="form-range"
                    min={100}
                    max={1200}
                    value={width}
                    onChange={({ target }) => {
                        setWidth(parseInt(target.value))
                    }}
                />
            </label>
        </>
    )
}
