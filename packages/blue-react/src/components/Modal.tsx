import { FormEvent, useEffect, useState, useRef, ReactNode, useId } from "react"
import type Dialog from "bootstrap/js/dist/dialog.js"
import { getPhrase, ModalType } from "./shared"

export interface ModalProps {
    modalContent?: string
    modalTitle?: string
    modalIcon?: ReactNode
    unSetModalContent: (modalContent?: string) => void
    /**
     * A string is the entered value, a boolean is a confirmation, and null is cancellation.
     */
    onSubmit?: (input: string | boolean | null) => void
    defaultInput?: string
    type: ModalType
    inputType?: string
    switchPrimaryBtn?: boolean
    acceptBtnText?: string
    cancelBtnText?: string
}

/**
 * Native Bootstrap 6 dialog. The Modal API name is retained for existing Blue consumers.
 */
export default function Modal({
    modalContent,
    modalTitle,
    modalIcon,
    unSetModalContent,
    onSubmit,
    defaultInput,
    type,
    inputType = "text",
    switchPrimaryBtn = false,
    acceptBtnText,
    cancelBtnText
}: ModalProps) {
    const modalRef = useRef<HTMLDialogElement>(null)
    const instanceRef = useRef<Dialog | null>(null)
    const instanceReady = useRef<Promise<Dialog | null>>(Promise.resolve(null))
    const callbacks = useRef({ unSetModalContent, onSubmit })
    const submitted = useRef(false)
    const transition = useRef<Promise<void>>(Promise.resolve())
    const titleId = useId()
    const [input, setInput] = useState(defaultInput || "")

    useEffect(() => {
        callbacks.current = { unSetModalContent, onSubmit }
    }, [unSetModalContent, onSubmit])

    useEffect(() => {
        const element = modalRef.current
        if (!element) return
        let disposed = false
        const onHidden = () => {
            if (!submitted.current) {
                callbacks.current.unSetModalContent()
                callbacks.current.onSubmit?.(null)
            }
        }
        const onShown = () => element.querySelector<HTMLElement>(".form-control, .btn-solid")?.focus()
        instanceReady.current = import("bootstrap/js/dist/dialog.js").then(({ default: Dialog }) => {
            if (disposed) return null
            const instance = new Dialog(element)
            instanceRef.current = instance
            element.addEventListener("hidden.bs.dialog", onHidden)
            element.addEventListener("shown.bs.dialog", onShown)
            return instance
        })
        return () => {
            disposed = true
            element.removeEventListener("hidden.bs.dialog", onHidden)
            element.removeEventListener("shown.bs.dialog", onShown)
            instanceRef.current?.dispose()
            instanceRef.current = null
        }
    }, [])

    useEffect(() => {
        setInput(defaultInput || "")
    }, [defaultInput, modalContent])

    useEffect(() => {
        const ready = instanceReady.current
        transition.current = transition.current.then(async () => {
            const instance = await ready
            if (!instance || instanceRef.current !== instance) return
            if (modalContent !== undefined) {
                submitted.current = false
                await instance.show()
            } else {
                await instance.hide()
            }
        })
    }, [modalContent])

    const finish = (result: string | boolean | null) => {
        if (submitted.current) return
        submitted.current = true
        const ready = instanceReady.current
        transition.current = transition.current.then(async () => {
            const instance = await ready
            if (instance && instanceRef.current === instance) await instance.hide()
        })
        unSetModalContent()
        onSubmit?.(result)
    }
    const submit = (event: FormEvent) => {
        event.preventDefault()
        finish(type === "ask" ? input : true)
    }
    const btnStyle = { maxWidth: "10rem" }

    return (
        <dialog className="dialog blue-modal" ref={modalRef} aria-labelledby={titleId}>
            <form onSubmit={submit}>
                <div className="dialog-header align-items-center">
                    {modalIcon !== undefined && <div className="me-3">{modalIcon}</div>}
                    <h5 className="dialog-title" id={titleId}>
                        {modalTitle || getPhrase("Message")}
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => finish(null)}
                        aria-label={getPhrase("Close")}
                    />
                </div>
                <div className="dialog-body" style={{ whiteSpace: "pre-wrap" }}>
                    {modalContent}
                    {type === "ask" && (
                        <input
                            type={inputType}
                            className="form-control mt-1"
                            value={input}
                            onChange={({ target }) => setInput(target.value)}
                            autoFocus
                        />
                    )}
                </div>
                <div className="dialog-footer">
                    <button
                        type="submit"
                        className={`theme-primary ${switchPrimaryBtn ? "btn-outline" : "btn-solid"} d-block w-100`}
                        style={btnStyle}
                    >
                        {acceptBtnText || (type === "verify" ? getPhrase("Yes") : "OK")}
                    </button>
                    {(type === "ask" || type === "verify") && (
                        <button
                            type="button"
                            className={`theme-primary ${switchPrimaryBtn && type === "verify" ? "btn-solid" : "btn-outline"} d-block w-100`}
                            style={btnStyle}
                            onClick={() => finish(type === "verify" ? false : null)}
                        >
                            {cancelBtnText || getPhrase(type === "verify" ? "No" : "Cancel")}
                        </button>
                    )}
                </div>
            </form>
        </dialog>
    )
}
