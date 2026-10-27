import { Button } from "blue-react"
import { Dialog } from "bootstrap"
import { useEffect, useRef } from "react"

export default function NonModalDialogDemo() {
    const ref = useRef<HTMLDialogElement>(null)
    const dialogRef = useRef<Dialog>(null)

    useEffect(() => {
        if (!ref.current) return

        const dialog = new Dialog(ref.current, { modal: false })
        dialogRef.current = new Dialog(ref.current, { modal: false })

        return () => {
            dialogRef.current = null
            dialog.dispose()
        }
    }, [])

    return (
        <>
            <Button label="Open non-modal dialog" onClick={() => dialogRef.current?.show()} />

            <dialog ref={ref} className="dialog">
                <div className="dialog-header">
                    <h1 className="dialog-title">Non-modal dialog</h1>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => dialogRef.current?.hide()}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="dialog-body">
                    <p>This dialog doesn’t block the page. You can still interact with content behind it.</p>
                </div>
                <div className="dialog-footer">
                    <button
                        type="button"
                        className="btn-solid theme-secondary"
                        onClick={() => dialogRef.current?.hide()}
                    >
                        Close
                    </button>
                </div>
            </dialog>
            <button
                className="blue-modal-backdrop"
                onClick={() => {
                    dialogRef.current?.hide()
                }}
            >
                Close dialog
            </button>
        </>
    )
}
