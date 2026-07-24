import { StatusType } from "./shared.js"

export function startLoading() {
    ;(document.querySelector(".blue-loading") as HTMLElement).style.display = "block"
}

export function finishLoading() {
    ;(document.querySelector(".blue-loading") as HTMLElement).style.display = ""
}

export function showSuccess() {
    ;(document.querySelector(".blue-status-success") as HTMLElement).style.display = "flex"
}

export function hideSuccess() {
    ;(document.querySelector(".blue-status-success") as HTMLElement).style.display = ""
}

/**
 * Resets alert messages that was set with `setAlertMessage`.
 * When using React, you should use `StatusProvider` instead: https://bruegmann.github.io/blue-react/v9/component/StatusProvider
 * @param alertClassName Leave empty to reset messages of any status type
 */
export function resetAlertMessage(alertClassName?: StatusType) {
    if (!alertClassName) {
        ;(["loading", "success", "info", "warning", "danger"] as StatusType[]).forEach((status: StatusType) => {
            resetAlertMessage(status)
        })
    } else {
        const alertElement = document.querySelector(".blue-status-alert") as HTMLElement | null
        const statusElement = document.querySelector(".blue-status-" + alertClassName) as HTMLElement | null
        if (statusElement) statusElement.style.display = ""
        if (alertElement) {
            alertElement.style.display = ""
            alertElement.classList.remove("alert-" + (alertClassName === "loading" ? "info" : alertClassName))
        }
    }
}

/**
 * When using React, you should use `StatusProvider` instead: https://bruegmann.github.io/blue-react/v9/component/StatusProvider
 */
export function setAlertMessage(
    message: string,
    alertClassName: StatusType = "info",
    close: boolean = false,
    detailText?: string
) {
    const alertElement = document.querySelector(".blue-status-alert") as HTMLElement | null
    const statusElement = document.querySelector(".blue-status-" + alertClassName) as HTMLElement | null

    if (statusElement) statusElement.style.display = "flex"
    if (alertElement) {
        alertElement.style.display = "block"
        alertElement.classList.add("alert-" + (alertClassName === "loading" ? "info" : alertClassName))

        alertElement.querySelector(".alert-body")!.innerHTML = `<h2>` + message + `</h2>`
        if (detailText) {
            alertElement.querySelector(".alert-body")!.innerHTML += `<span>` + detailText + `</span>`
        }

        const btnCloseElement = alertElement.querySelector(".btn-close") as HTMLElement

        if (close) {
            btnCloseElement.style.display = "inline-block"
            btnCloseElement.onclick = () => {
                resetAlertMessage(alertClassName)
            }
        } else {
            btnCloseElement.style.display = "none"
        }
    }
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
}

export const guid = () => s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()

export function scrollToTop() {
    const routerPage = document.querySelector(".router-page.active") as HTMLElement

    routerPage.scroll({
        behavior: "smooth",
        left: 0,
        top: 0
    })
}

const httpStatusCodes: { [statusCode: number]: string } = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    408: "Request Timeout",
    409: "Conflict",
    500: "Internal Server Error",
    502: "Bad Gateway"
}

export function fetchData(
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
    showErrorDetail: boolean | undefined = true,
    onError?: (errorMessage: string, reason: Response) => void
) {
    return fetch(input, init)
        .then((response) => {
            if (!response.ok) throw response
            return response
        })
        .catch((reason: Response) => {
            if (reason.text) {
                reason.text().then((errorMessage) => {
                    setAlertMessage(
                        `${reason.status} - ${reason.statusText || httpStatusCodes[reason.status] || "Error"}`,
                        "danger",
                        true,
                        showErrorDetail
                            ? errorMessage
                                  .toString()
                                  .replace(/(<style[\w\W]+style>)/g, "")
                                  .replace(/<[^>]+>/g, "")
                            : undefined
                    )

                    if (onError) {
                        onError(errorMessage, reason)
                    }
                })
            }
            throw reason
        })
}
