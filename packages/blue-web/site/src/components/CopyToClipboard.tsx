import Button from "blue-react/dist/components/button.js"
import { useEffect, useState, type ComponentProps } from "react"
import { Clipboard, ClipboardCheck } from "react-bootstrap-icons"

export interface CopyToClipboardProps {
    content: string
}

export default function CopyToClipboard({ content, ...rest }: CopyToClipboardProps & ComponentProps<typeof Button>) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => {
                setCopied(false)
            }, 2000)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [copied])

    return (
        <Button
            color={copied ? "success" : "primary"}
            onClick={() => {
                navigator.clipboard.writeText(content)
                setCopied(true)
            }}
            iconBefore={copied ? <ClipboardCheck /> : <Clipboard />}
            label={copied ? "Copied!" : "Copy"}
            {...rest}
        />
    )
}
