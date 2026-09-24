import Layout from "blue-react/dist/components/Layout"
import LayoutSplitter from "blue-react/dist/components/LayoutSplitter"
import Button from "blue-react/dist/components/Button"
import { useId, useRef, useState } from "react"
import { closeInspector, openInspector, toggleInspector } from "blue-web/dist/js/layout"

export default function LayoutWithSplitterExample() {
    const [showCommand, setShowCommand] = useState<"show-modal" | "show" | undefined>()
    const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false)

    const layoutDivRef = useRef<HTMLDivElement>(null)
    const inspectorId = useId()

    return (
        <Layout
            ref={layoutDivRef}
            onInspectorChange={setIsInspectorOpen}
            style={{ height: "400px" }}
            header={
                <>
                    <Button
                        label="Toggle Inspector"
                        active={isInspectorOpen}
                        onClick={() => {
                            toggleInspector(layoutDivRef.current!, showCommand)
                        }}
                        aria-controls={inspectorId}
                        aria-expanded={isInspectorOpen}
                    />
                </>
            }
        >
            <LayoutSplitter
                drawerTitle="AI Chat"
                inspectorId={inspectorId}
                start={
                    <div className="container">
                        <p>Hello World</p>

                        <label className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={showCommand === "show"}
                                onChange={() => setShowCommand(showCommand === "show" ? undefined : "show")}
                            />
                            <span className="form-check-label">
                                To toggle inspector on mobile, use "show" instead of "show-modal"
                            </span>
                        </label>
                    </div>
                }
                end={
                    <div className="vstack h-100">
                        <div className="d-flex border-bottom">
                            <Button label="New Chat" iconBefore={<>➕</>} sm variant="menu-item" />
                            <Button label="Save" iconBefore={<>✔️</>} sm variant="menu-item" />
                        </div>

                        <div className="vstack align-items-center justify-content-center flex-grow-1 text-secondary">
                            <span>✨</span>
                            <small>The chat is empty</small>
                        </div>

                        <div className="p-2">
                            <div className="bg-body border rounded p-1">
                                <div className="text-secondary p-2 pb-5">Placeholder text...</div>
                                <div className="text-end">
                                    <Button
                                        label="Send"
                                        labelHidden
                                        iconBefore={<>⬆️</>}
                                        color="primary"
                                        variant="filled"
                                        square
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
        </Layout>
    )
}
