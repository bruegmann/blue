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
                <div className={clsx("accordion-button collapsed", headerButtonClassName)}>{header}</div>
            </summary>
            <div className={clsx("accordion-body", bodyClassName)}>{children}</div>
        </details>
    )
}
