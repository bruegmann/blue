import { useEffect, useState, ComponentProps, ReactNode, ElementType } from "react"
import clsx from "clsx"
import { getPhrase } from "./shared"

export type ButtonVariant = "filled" | "soft" | "plain" | "outline" | "link" | "menu-item"
export type ButtonColor =
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

function getButtonVariantClass(variant: ButtonVariant) {
    switch (variant) {
        case "soft":
            return "btn-subtle"
        case "plain":
            return "btn-text"
        case "outline":
            return "btn-outline"
        case "link":
            return "btn-link"
        case "menu-item":
            return "blue-menu-item"
        default:
            return "btn-solid"
    }
}

export type ButtonProps = ComponentProps<"a"> &
    ComponentProps<"button"> & {
        elementType?: ElementType
        variant?: ButtonVariant
        color?: ButtonColor
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
    color,
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

    const hasVariantOrColor = variant !== undefined || color !== undefined
    const variantClass = getButtonVariantClass(variant ?? "soft")
    const buttonColor = color || "secondary"
    const themeClass = `theme-${buttonColor === "dark" ? "inverse" : buttonColor === "light" ? "secondary" : buttonColor}`
    const themed = hasVariantOrColor && variant !== "menu-item" && (variant !== "link" || color !== undefined)

    return (
        <Comp
            type={Comp === "button" && type === undefined ? "button" : type}
            className={clsx(
                icon ? "btn-icon" : "btn",
                {
                    [variantClass]: !success && hasVariantOrColor,
                    [themeClass]: !success && themed,
                    "btn-solid theme-success": success,
                    "btn-sm": sm,
                    "btn-lg": lg,
                    active: active
                },
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
