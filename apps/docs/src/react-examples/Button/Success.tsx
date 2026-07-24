import { useState } from "react"
import { Button } from "blue-react"

export default function SuccessExample() {
    const [success, setSuccess] = useState(false)

    return (
        <Button
            label="Click for success"
            onClick={() => {
                setSuccess(true)
            }}
            success={success}
        />
    )
}
