import { Button } from "blue-react"

export default function Variants() {
    return (
        <div className="vstack gap-3">
            <div className="d-flex flex-wrap gap-3">
                <Button label="Default uses Bootstrap's base styling" />
                <Button label="Make button look like a link" variant="link" />
            </div>
            <div className="d-flex flex-wrap gap-3">
                <Button label="Primary" theme="primary" />
                <Button label="Secondary" theme="secondary" />
                <Button label="Success" theme="success" />
                <Button label="Danger" theme="danger" />
                <Button label="Warning" theme="warning" />
                <Button label="Info" theme="info" />
                <Button label="Accent" theme="accent" />
                <Button label="Inverse" theme="inverse" />
                <Button label="Light" theme="light" />
                <Button label="Dark" theme="dark" />
            </div>
            <div className="d-flex flex-wrap gap-3">
                <Button label="Primary" theme="primary" variant="text" />
                <Button label="Secondary" variant="text" />
                <Button label="Success" theme="success" variant="text" />
                <Button label="Danger" theme="danger" variant="text" />
                <Button label="Warning" theme="warning" variant="text" />
                <Button label="Info" theme="info" variant="text" />
                <Button label="Accent" theme="accent" variant="text" />
                <Button label="Inverse" theme="inverse" variant="text" />
                <Button label="Light" theme="light" variant="text" />
                <Button label="Dark" theme="dark" variant="text" />
            </div>
            <div className="d-flex flex-wrap gap-3">
                <Button label="Primary" theme="primary" variant="solid" />
                <Button label="Secondary" variant="solid" />
                <Button label="Success" theme="success" variant="solid" />
                <Button label="Danger" theme="danger" variant="solid" />
                <Button label="Warning" theme="warning" variant="solid" />
                <Button label="Info" theme="info" variant="solid" />
                <Button label="Accent" theme="accent" variant="solid" />
                <Button label="Inverse" theme="inverse" variant="solid" />
                <Button label="Light" theme="light" variant="solid" />
                <Button label="Dark" theme="dark" variant="solid" />
            </div>
            <div className="d-flex flex-wrap gap-3">
                <Button label="Primary" theme="primary" variant="outline" />
                <Button label="Secondary" variant="outline" />
                <Button label="Success" theme="success" variant="outline" />
                <Button label="Danger" theme="danger" variant="outline" />
                <Button label="Warning" theme="warning" variant="outline" />
                <Button label="Info" theme="info" variant="outline" />
                <Button label="Accent" theme="accent" variant="outline" />
                <Button label="Inverse" theme="inverse" variant="outline" />
                <Button label="Light" theme="light" variant="outline" />
                <Button label="Dark" theme="dark" variant="outline" />
            </div>
            <div className="d-flex flex-wrap gap-3">
                <Button label="Primary" theme="primary" variant="link" />
                <Button label="Secondary" variant="link" />
                <Button label="Success" theme="success" variant="link" />
                <Button label="Danger" theme="danger" variant="link" />
                <Button label="Warning" theme="warning" variant="link" />
                <Button label="Info" theme="info" variant="link" />
                <Button label="Accent" theme="accent" variant="link" />
                <Button label="Inverse" theme="inverse" variant="link" />
                <Button label="Light" theme="light" variant="link" />
                <Button label="Dark" theme="dark" variant="link" />
            </div>
        </div>
    )
}
