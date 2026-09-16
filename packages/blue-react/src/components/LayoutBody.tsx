import clsx from "clsx"
import { ComponentProps } from "react"

export default function LayoutBody({ className, children, ...props }: ComponentProps<"div">) {
    return (
        <div className={clsx("blue-layout-body", className)} {...props}>
            {children}
        </div>
    )
}
