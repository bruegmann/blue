import {
    startLoading,
    finishLoading,
    showSuccess,
    hideSuccess,
    setAlertMessage,
    resetAlertMessage,
    guid,
    scrollToTop
} from "@/src/js/utils"
import { PlayFill } from "react-bootstrap-icons"

const utilitiesFunctions = [
    {
        definition: "startLoading()",
        description: "Shows loading animation.",
        demo: (
            <button className="btn btn-light" onClick={() => startLoading()}>
                <PlayFill />
            </button>
        )
    },
    {
        definition: "finishLoading()",
        description: "Hides loading animation.",
        demo: (
            <button className="btn btn-light" onClick={() => finishLoading()}>
                <PlayFill />
            </button>
        )
    },
    {
        definition: "showSuccess()",
        description: "Shows success symbol.",
        demo: (
            <button
                className="btn btn-light"
                onClick={() => {
                    console.log("show success")
                    showSuccess()
                }}
            >
                <PlayFill />
            </button>
        )
    },
    {
        definition: "hideSuccess()",
        description: "Hides success symbol.",
        demo: (
            <button className="btn btn-light" onClick={() => hideSuccess()}>
                <PlayFill />
            </button>
        )
    },
    {
        definition: "setAlertMessage(message, alertClassName, close, detailText)",
        description: (
            <span>
                Shows an alert message.
                <br />
                Possible values for alertClassName: <code>loading</code>, <code>success</code>, <code>info</code>,{" "}
                <code>warning</code>, <code>danger</code>
            </span>
        ),
        demo: (
            <button
                className="btn btn-light"
                onClick={() =>
                    setAlertMessage(
                        "Hey, this is a message",
                        "danger",
                        true,
                        `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
`
                    )
                }
            >
                <PlayFill />
            </button>
        )
    },
    {
        definition: "resetAlertMessage(alertClassName)",
        description: "Resets alert message and removes it.",
        demo: (
            <button className="btn btn-light" onClick={() => resetAlertMessage("danger")}>
                <PlayFill />
            </button>
        )
    },
    {
        definition: "guid()",
        description: "Returns string of random characters.",
        demo: (
            <button className="btn btn-light" onClick={() => alert("Generated GUID: " + guid())}>
                <PlayFill />
            </button>
        )
    },
    {
        definition: "scrollToTop()",
        description: "Scrolls to the top of the page.",
        demo: (
            <button className="btn btn-light" onClick={() => scrollToTop()}>
                <PlayFill />
            </button>
        )
    },
    {
        definition: "fetchData(input, init?, showErrorDetail? = true)",
        description: (
            <span>
                Uses native <code>fetch</code> function, but adds error handling and shows error messages if there are
                any.
            </span>
        )
    }
]

export default function UtilsDemo() {
    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Definition</th>
                        <th>Description</th>
                        <th>Demo</th>
                    </tr>
                </thead>

                <tbody>
                    {utilitiesFunctions
                        .sort((a, b) => (a.definition > b.definition ? 1 : b.definition > a.definition ? -1 : 0))
                        .map((fun, index) => (
                            <tr key={index}>
                                <td>
                                    <code>{fun.definition}</code>
                                </td>
                                <td>{fun.description}</td>
                                {fun.demo ? <td>{fun.demo}</td> : <td />}
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    )
}
