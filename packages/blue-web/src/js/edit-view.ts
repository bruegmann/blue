/**
 * EditView is a Custom Element that displays a edit view of its content and allows the user to confirm or dismiss the changes.
 */
export class EditView extends HTMLElement {
    private confirmTimeout: any

    connectedCallback() {
        this.render()
    }

    disconnectedCallback() {
        if (this.confirmTimeout) {
            clearTimeout(this.confirmTimeout)
        }
    }

    private render() {
        const root = document.createElement("form")
        root.style.position = "relative"

        const children = Array.from(this.childNodes)

        this.appendChild(root)

        children.forEach((child) => root.appendChild(child))

        root.addEventListener("submit", this.onSubmit.bind(this))
        root.addEventListener("keydown", this.onKeydown.bind(this))
        root.addEventListener("focusout", this.onFocusout.bind(this))
    }

    private onSubmit(e: SubmitEvent) {
        e.preventDefault()
        this.confirm()
    }

    private onKeydown(e: KeyboardEvent) {
        if (e.key === "Esc" || e.key === "Escape") {
            this.dismiss()
        }
    }

    private onFocusout(e: FocusEvent) {
        if (!this.contains(e.relatedTarget as Node)) {
            if (this.confirmTimeout) {
                clearTimeout(this.confirmTimeout)
            }
            this.confirmTimeout = setTimeout(() => {
                this.confirm()
                this.confirmTimeout = null
            }, 500)
        }
    }

    private confirm() {
        this.dispatchEvent(new CustomEvent("Confirm", { bubbles: true, composed: true }))
    }

    private dismiss() {
        this.dispatchEvent(new CustomEvent("Dismiss", { bubbles: true, composed: true }))
    }
}

customElements.define("edit-view", EditView)
