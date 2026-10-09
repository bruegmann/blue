import clsx from "clsx"
import { ComponentProps, ReactNode } from "react"

export type AccordionItemProps = {
    header?: ReactNode
    headerClassName?: string
    headerButtonClassName?: string
    bodyClassName?: string
} & ComponentProps<"details">

export default function AccordionItem({
    header,
    headerClassName,
    headerButtonClassName,
    bodyClassName,
    className,
    children,
    ...props
}: AccordionItemProps) {
    return (
        <details className={clsx("accordion-item blue-collapse", className)} {...props}>
            <summary className={clsx("accordion-header", headerClassName)}>
                <span className={headerButtonClassName}>{header}</span>
                <svg
                    className="accordion-icon"
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                >
                    <path d="m2 5 6 6 6-6" />
                </svg>
            </summary>
            <div className={clsx("accordion-body", bodyClassName)}>{children}</div>
        </details>
    )
}
