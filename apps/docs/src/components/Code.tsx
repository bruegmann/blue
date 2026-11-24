import CopyToClipboard from "./CopyToClipboard"
import { Prism } from "react-syntax-highlighter"

export interface CodeProps {
    code: string
    language?: string
}

export default function Code({ code, language = "html" }: CodeProps) {
    return (
        <div className="position-relative">
            <div className="overflow-auto rounded-3" style={{ maxHeight: "400px", transition: "max-height .2s" }}>
                <Prism customStyle={{ backgroundColor: "" }} language={language} style={{}}>
                    {code}
                </Prism>
            </div>
            <CopyToClipboard content={code} className="position-absolute top-0 end-0 mt-1 me-1 btn-sm" />
        </div>
    )
}
