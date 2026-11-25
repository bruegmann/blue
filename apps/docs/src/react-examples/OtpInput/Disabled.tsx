import { OtpInput } from "blue-react"
import { useId, useState } from "react"

export default function DisabledOtpInputDemo() {
    const [disabled, setDisabled] = useState(true)
    const switchId = useId()

    return (
        <>
            <div className="form-field mb-5">
                <div className="switch">
                    <input
                        type="checkbox"
                        id={switchId}
                        role="switch"
                        checked={disabled}
                        onChange={() => setDisabled(!disabled)}
                    />
                </div>
                <label htmlFor={switchId}>Disabled</label>
            </div>

            <OtpInput label="OTP" labelHidden disabled={disabled} />
        </>
    )
}
