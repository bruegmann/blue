import { guid } from "./utils.js"
import { getPhrase } from "./shared.js"

export type DialogType = "ask" | "tell" | "verify"

export interface DialogOptions {
    title?: string
    icon?: string
    switchPrimaryBtn?: boolean
    acceptBtnText?: string
    cancelBtnText?: string
    inputType?: string
    defaultValue?: string
    id?: string
}

export async function ask(text: string, options: DialogOptions | string = {}): Promise<string | boolean> {
    return await dialog("ask", text, options)
}

export async function tell(text: string, options: DialogOptions | string = {}): Promise<void> {
    await dialog("tell", text, options)
}

export async function verify(text: string, options: DialogOptions | string = {}): Promise<boolean> {
    return (await dialog("verify", text, options)) === true
}

async function dialog(dialogType: DialogType, text: string, options: DialogOptions | string = {}) {
    let {
        title = getPhrase(dialogType === "verify" ? "Confirm" : dialogType === "ask" ? "Question" : "Message"),
        icon = undefined,
        switchPrimaryBtn = false,
        acceptBtnText = "OK",
        cancelBtnText = getPhrase("Cancel"),
        inputType = "text",
        defaultValue,
        id
    } = typeof options === "string" ? JSON.parse(options) : options
    const _id = id || guid()

    const addToDom = () => {
        document.body.insertAdjacentHTML(
            "beforeend",
            /* HTML */ `<dialog class="blue-modal dialog" id="${_id}" aria-labelledby="${_id}-label" closedby="any">
                <form>
                    <div class="dialog-header">
                        ${icon ? /* html */ `<div class="me-3">${icon}</div>` : ""}
                        <h1 class="dialog-title fs-lg" id="${_id}-label">${title}</h1>
                    </div>
                    <div class="dialog-body">
                        ${
                            dialogType === "ask"
                                ? /* HTML */ `<label for="${_id}-input" class="blue-label">${text}</label>
                                      <input
                                          type="${inputType}"
                                          ${defaultValue !== undefined ? ` value="${defaultValue}"` : ""}
                                          id="${_id}-input"
                                          class="form-control"
                                      />`
                                : text
                        }
                    </div>
                    <div class="dialog-footer">
                        ${
                            dialogType === "verify" || dialogType === "ask"
                                ? /* HTML */ `<button
                                      type="button"
                                      class="btn ${switchPrimaryBtn ? "btn-solid theme-primary" : "blue-btn-plain-primary"}"
                                      onclick="document.getElementById('${_id}').close()"
                                  >
                                      ${cancelBtnText}
                                  </button>`
                                : ""
                        }
                        <button
                            type="submit"
                            class="btn ${switchPrimaryBtn ? "blue-btn-plain-primary" : "btn-solid theme-primary"}"
                        >
                            ${acceptBtnText}
                        </button>
                    </div>
                </form>
            </dialog>`
        )
    }

    if (!document.getElementById(_id)) {
        addToDom()
    }

    const modalEl = document.getElementById(_id)
    if (!(modalEl instanceof HTMLDialogElement)) {
        throw new Error(`Dialog "${_id}" must be a native dialog element.`)
    }
    const form = modalEl.querySelector<HTMLFormElement>(":scope > form:not(.blue-modal-backdrop)")
    const input = modalEl.querySelector<HTMLInputElement>("input")
    if (!form || (dialogType === "ask" && !input)) {
        throw new Error(`Dialog "${_id}" is missing its form or prompt input.`)
    }

    return new Promise<boolean | string>((resolve) => {
        const removeFromDom = () => {
            modalEl.remove()
        }

        const onHidden = () => {
            removeFromDom()
            resolve(false)
        }

        modalEl.addEventListener("close", onHidden, { once: true })
        modalEl.showModal()

        form.addEventListener("submit", (e) => {
            e.preventDefault()

            if (dialogType === "ask" && input) {
                resolve(input.value)
            } else {
                resolve(true)
            }

            modalEl.close()
            removeFromDom()
        })
    })
}

declare global {
    interface Window {
        blueWeb: any
    }
}

window.blueWeb = window.blueWeb || {}
window.blueWeb.dialog = {
    ask,
    tell,
    verify
}
