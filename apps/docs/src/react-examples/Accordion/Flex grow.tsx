import { Accordion, AccordionItem } from "blue-react"
import { useId } from "react"

export default function AccordionFlexGrowExample() {
    const name = useId()

    return (
        <div className="bg-warning d-flex flex-column" style={{ height: "600px" }}>
            <Accordion className="flex-grow-1">
                <AccordionItem header="Accordion item 1" name={name} open>
                    <div className="bg-info h-100" style={{ minHeight: "10px" }}></div>
                </AccordionItem>
                <AccordionItem header="Accordion item 2" name={name}>
                    Show something
                </AccordionItem>
                <AccordionItem header="Accordion item 3" name={name}>
                    Show something
                </AccordionItem>
            </Accordion>
        </div>
    )
}
