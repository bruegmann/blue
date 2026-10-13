import { useEffect, useState, ComponentProps, ReactNode, ElementType } from "react"
import clsx from "clsx"
import { getPhrase } from "./shared"

export type ButtonVariant = "solid" | "outline" | "subtle" | "text" | "link"
export type ButtonTheme =
    | "theme"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "accent"
    | "inverse"
    | "light"
    | "dark"

export type ButtonProps = ComponentProps<"a"> &
    ComponentProps<"button"> & {
        elementType?: ElementType
        variant?: ButtonVariant
        theme?: ButtonTheme
        sm?: boolean
        lg?: boolean
        iconBefore?: ReactNode
        iconAfter?: ReactNode
        label?: string
        labelHidden?: boolean
        busy?: boolean

        /** Button will be displayed as successful for 3 seconds. */
        success?: boolean

        active?: boolean

        /** Use Bootstrap's icon-only button styling. Provide an accessible name. */
        icon?: boolean
    } & {
        /**
         * For compatibility with React Router NavLink
         */
        to?: string
        /**
         * For compatibility with React Router NavLink
         */
        exact?: boolean
    }

export default function Button({
    elementType,
    className,
    type,
    variant,
    theme,
    sm,
    lg,
    iconBefore,
    iconAfter,
    label,
    labelHidden,
    busy: busyProp,
    success: successProp,
    active,
    icon,
    ...props
}: ButtonProps) {
    const Comp = elementType || (props.href ? "a" : "button")
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (successProp) {
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
            }, 3000)
        }
    }, [successProp])

    const variantClass = variant && !success ? `btn-${variant}` : theme ? "btn-subtle" : undefined
    const themeClass = theme && !success ? `theme-${theme}` : undefined

    return (
        <Comp
            type={Comp === "button" && type === undefined ? "button" : type}
            className={clsx(
                themeClass,
                {
                    btn: !variant || variant === "link",
                    "btn-icon": icon,
                    "btn-solid theme-success": success,
                    "btn-sm": sm,
                    "btn-lg": lg,
                    active: active
                },
                variantClass,
                className
            )}
            {...props}
        >
            {busyProp ? (
                <>
                    <span className="spinner-border spinner-border-sm bi me-1" aria-hidden></span>
                    <span role="status">{getPhrase("Loading")}…</span>
                </>
            ) : success ? (
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        className="bi bi-check-lg me-1"
                        viewBox="0 0 16 16"
                    >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"></path>
                    </svg>
                    <span role="status">{getPhrase("Successful")}</span>
                </>
            ) : (
                <>
                    {iconBefore !== null && (
                        <span className="blue-btn-icon-wrapper" aria-hidden>
                            {iconBefore}
                        </span>
                    )}
                    {label && !labelHidden && <span className="text-truncate">{label}</span>}
                    {props.children}
                    {iconAfter != null && (
                        <span className="blue-btn-icon-wrapper" aria-hidden>
                            {iconAfter}
                        </span>
                    )}
                </>
            )}
        </Comp>
    )
}
