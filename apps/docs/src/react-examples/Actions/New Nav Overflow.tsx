import { NavOverflow } from "bootstrap"
import { useEffect, useRef } from "react"

export default function NewNavOverflowDemo() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            const navOverflow = new NavOverflow(ref.current, {
                moreText: "More"
            })
        }
    }, [])

    return (
        <div ref={ref} className="nav-overflow">
            <ul className="nav nav-underline">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">
                        🌍 Home
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        🌑 Dashboard
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        ☀️ Products
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        🚀 Services
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        🌌 Analytics
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        📁 Reports
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        ⚙️ Settings
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        ❓ Help
                    </a>
                </li>
            </ul>
        </div>
    )
}
