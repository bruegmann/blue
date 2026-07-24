import CopyToClipboard from "./CopyToClipboard"
import { Prism } from "react-syntax-highlighter"
import { synthwave84 } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useState } from "react"

export interface CodeProps {
    code: string
    language?: string
    expandable?: boolean
}

export default function Code({ code, language = "html", expandable = false }: CodeProps) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className="position-relative">
            <div
                className="overflow-auto rounded-3"
                style={{ maxHeight: expandable && !expanded ? "200px" : "400px", transition: "max-height .2s" }}
            >
                <Prism language={language} style={synthwave84}>
                    {code}
                </Prism>
            </div>

            {expandable && (
                <div
                    className={`position-absolute bottom-0 start-0 end-0 d-flex justify-content-center align-items-center ${expanded ? "py-1" : "top-0 py-3"} rounded-bottom`}
                    style={{ backgroundImage: "linear-gradient(transparent, black)" }}
                >
                    <button type="button" className="btn btn-dark" onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Collapse" : "Expand"}
                    </button>
                </div>
            )}

            <CopyToClipboard content={code} className="position-absolute top-0 end-0 mt-1 me-1 btn-sm" />
        </div>
    )
}
