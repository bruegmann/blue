import { Button, OtpInput } from "blue-react"
import { useState } from "react"

export default function UseOtpInputDemo() {
    const [value, setValue] = useState("65")

    return (
        <>
            <OtpInput label="OTP" value={value} onChange={setValue} />

            <p>You have entered: {value}</p>

            <Button label="Change value to 123" onClick={() => setValue("123")} />
        </>
    )
}
