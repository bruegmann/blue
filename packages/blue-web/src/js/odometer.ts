/**
 * Odometer web component for animated number display
 *
 * @element bl-odometer
 * @attr {number} value - Current value to display
 * @attr {number} max - Maximum value before showing "+"
 * @fires change - Fired when value changes
 * @cssprop --bl-odometer-duration - Transition duration for number animation (default: 0.4s)
 */
class Odometer extends HTMLElement {
    private wrapper!: HTMLSpanElement
    private _initialized = false
    private _resetTimer: number | null = null

    static get observedAttributes() {
        return ["value", "max"]
    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        if (!this._initialized) {
            this.setup()
            this._initialized = true
            // Initialen Wert anwenden (Markup-Attribut oder default)
            this.updateValue(this.value)
        }
    }

    private setup() {
        const style = document.createElement("style")
        style.textContent = /* CSS */ `
        :host {
          display: inline-flex;
          min-width: 1em;
          height: 1em;
          text-align: center;
          overflow: hidden;
          line-height: 1em;
        }
        .numbers {
          display: flex;
          flex-direction: column;
          transition: transform var(--bl-odometer-duration, 0.4s) cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .numbers span {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 1em;
        }`

        const wrapper = document.createElement("span")
        wrapper.classList.add("numbers")
        wrapper.setAttribute("aria-hidden", "true")

        this.shadowRoot!.append(style, wrapper)
        this.wrapper = wrapper
        this.rebuildNumbers()
    }

    private rebuildNumbers() {
        this.wrapper.innerHTML = ""
        const max = this.max

        for (let i = 0; i <= max; i++) {
            const s = document.createElement("span")
            s.textContent = String(i)
            this.wrapper.appendChild(s)
        }
        const plus = document.createElement("span")
        plus.textContent = `${max}+`
        this.wrapper.appendChild(plus)

        // Aktuellen Wert neu anwenden
        if (this._initialized) {
            this.updateValue(this.value)
        }
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (newValue !== oldValue && this._initialized) {
            if (name === "value") {
                const prev = parseInt(oldValue ?? "0", 10) || 0
                const next = parseInt(newValue ?? "0", 10) || 0
                this.applyChangeState(prev, next)
                this.updateValue(next)
            } else if (name === "max") {
                this.rebuildNumbers()
            }
        }
    }

    private updateValue(value: number) {
        const max = this.max
        const index = value > max ? max + 1 : Math.max(0, value)
        const height = this.wrapper.getBoundingClientRect().height || 16
        this.wrapper.style.transform = `translateY(-${index * height}px)`
        const displayValue = value > max ? `${max}+` : `${value}`
        this.setAttribute("aria-label", displayValue)
    }

    private clearResetTimer() {
        if (this._resetTimer !== null) {
            clearTimeout(this._resetTimer)
            this._resetTimer = null
        }
    }

    private scheduleResetChange() {
        this.clearResetTimer()
        const delay = 3000
        this._resetTimer = window.setTimeout(() => {
            this.removeAttribute("data-change")
            this._resetTimer = null
        }, delay)
    }

    private applyChangeState(previous: number, next: number) {
        if (next > previous) {
            this.setAttribute("data-change", "up")
            this.scheduleResetChange()
        } else if (next < previous) {
            this.setAttribute("data-change", "down")
            this.scheduleResetChange()
        }
    }

    set value(value: number) {
        const current = this.value
        if (current !== value) {
            this.setAttribute("value", String(value))
            if (this._initialized) {
                this.dispatchEvent(
                    new CustomEvent("change", {
                        detail: { value },
                        bubbles: true,
                        composed: true
                    })
                )
            }
        }
    }

    get value(): number {
        return parseInt(this.getAttribute("value") || "0", 10) || 0
    }

    set max(value: number) {
        this.setAttribute("max", String(value))
    }

    get max(): number {
        return parseInt(this.getAttribute("max") || "9", 10) || 9
    }
}

if (!customElements.get("bl-odometer")) {
    customElements.define("bl-odometer", Odometer)
}

export { Odometer }
export default Odometer
