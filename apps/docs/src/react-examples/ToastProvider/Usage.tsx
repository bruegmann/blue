import { ToastProvider, useToast } from "blue-react"

function SubComponent() {
    const { addToast, clearToasts } = useToast()
    return (
        <div className="d-flex gap-5">
            <button
                type="button"
                className="btn theme-primary btn-subtle"
                onClick={() => {
                    addToast({
                        type: "success",
                        title: "Success!",
                        message: "ToastProvider works"
                    })
                }}
            >
                Click to add a toast
            </button>

            <button
                type="button"
                className="btn theme-danger btn-subtle"
                onClick={() => {
                    clearToasts()
                }}
            >
                Remove all messages
            </button>
        </div>
    )
}

export default function RootComponent() {
    return (
        <ToastProvider>
            <SubComponent />
        </ToastProvider>
    )
}
