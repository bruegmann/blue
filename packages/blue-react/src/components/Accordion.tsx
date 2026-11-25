import clsx from "clsx"
import { ComponentProps } from "react"

export type AccordionProps = ComponentProps<"div"> & {
    growing?: boolean
}

export default function Accordion({ className, children, growing, ...props }: AccordionProps) {
    return (
        <div className={clsx("accordion", className, { "blue-growing-accordion": growing })} {...props}>
            {children}
        </div>
    )
}
