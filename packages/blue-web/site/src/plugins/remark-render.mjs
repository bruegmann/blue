import { visit } from "unist-util-visit"

export default function remarkRender() {
    return (tree) => {
        visit(tree, "code", (node) => {
            if (node.meta && node.meta.includes("use:")) {
                node.type = "mdxJsxFlowElement"
                node.name = node.meta.split(":")[1].trim()
                node.attributes = [{ type: "mdxJsxAttribute", name: "code", value: node.value }]
                node.children = []
            }
        })
    }
}
