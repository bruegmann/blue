import { Button } from "blue-react"
import { ask } from "blue-web/dist/js/message"
import { useState } from "react"

export default function UseMessageApiDemo() {
    const [usersResponse, setUsersResponse] = useState<string>()

    return (
        <>
            <Button
                label="Ask"
                onClick={async () => {
                    const response = await ask("Please, your response?", {
                        title: "Question"
                    })
                    setUsersResponse(response.toString())
                }}
            />

            {usersResponse && <div>User's response: {usersResponse}</div>}
        </>
    )
}
