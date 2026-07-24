import { useEffect, useState } from "react"
const examples = import.meta.glob("/src/react-examples/**/*.tsx")

export default function ReactExampleRender({ modulePath }: { modulePath: string }) {
    const [Component, setComponent] = useState<any>()
    useEffect(() => {
        examples[modulePath]?.().then((mod: any) => {
            setComponent(() => mod.default)
        })
    }, [])
    if (!Component) {
        return <>Loading...</>
    }
    return <Component />
}
