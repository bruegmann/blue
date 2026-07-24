import { useState } from "react"
import { Button } from "blue-react"

export default function BasicUsageExample() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Button label="Click me" onClick={() => setCount(count + 1)} />

            <p>You have clicked the button {count} times.</p>
        </>
    )
}
