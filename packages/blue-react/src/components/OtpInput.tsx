import clsx from "clsx"
import { CSSProperties, useEffect, useId, useRef } from "react"
import { default as BtOtpInput } from "bootstrap/js/dist/otp-input.js"

export type OtpInputProps = {
    className?: string
    style?: CSSProperties
    value?: string
    onChange?: (value: string) => void
    label?: string
    labelClassName?: string
    labelHidden?: boolean
    id?: string
    autoFocus?: boolean
    length?: number
    disabled?: boolean
}

export default function OtpInput({
    className,
    style,
    value,
    onChange,
    label,
    labelClassName,
    labelHidden,
    id,
    autoFocus,
    length = 6,
    disabled
}: OtpInputProps) {
    const _id = useId()
    const idValue = id || _id
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            const otpInput = BtOtpInput.getOrCreateInstance(ref.current)

            ref.current.addEventListener("input.bs.otpInput", (event) => {
                onChange?.((event as unknown as { value: string }).value)
            })

            return () => {
                otpInput.dispose()
            }
        }
    }, [])

    useEffect(() => {
        if (ref.current) {
            const otpInput = BtOtpInput.getOrCreateInstance(ref.current)
            otpInput.setValue(value || "")
        }
    }, [value])

    return (
        <>
            {!labelHidden && label !== undefined && (
                <label className={clsx("form-label", labelClassName)} htmlFor={idValue}>
                    {label}
                </label>
            )}
            <div ref={ref} className={clsx("otp", className)} style={style}>
                <input
                    id={idValue}
                    type="text"
                    className="otp-input"
                    value={value}
                    maxLength={length}
                    aria-label={labelHidden && label !== undefined ? label : undefined}
                    autoFocus={autoFocus}
                    disabled={disabled}
                />
            </div>
        </>
    )
}
