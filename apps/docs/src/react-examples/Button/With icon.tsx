import { ArrowRight, Backpack } from "react-bootstrap-icons"
import { Button } from "blue-react"

export default function WithIcon() {
    return (
        <div className="hstack gap-3">
            <Button icon iconBefore={<Backpack />} aria-label="Button with icon before text" />
            <Button iconBefore={<Backpack />} label="Button with icon before text" />
            <Button label="Button with icon after text" iconAfter={<ArrowRight />} />
            <Button label="Icon will transform on hover" className="icon-link icon-link-hover" iconAfter={<ArrowRight />} />
        </div>
    )
}
