import clsx from "clsx"
import { ComponentProps } from "react"

export type AccordionProps = ComponentProps<"div">

export default function Accordion({ className, children, ...props }: AccordionProps) {
    return (
        <div className={clsx("blue-accordion accordion", className)} {...props}>
            {children}
        </div>
    )
}
