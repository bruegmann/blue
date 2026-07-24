import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import docgen from "react-docgen-typescript"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsPath = path.resolve(__dirname, "../../../../packages/blue-react/src/components")

export async function getComponents() {
    const files = await fs.readdir(componentsPath)

    return files.filter((f) => f.endsWith(".tsx")).map((f) => f.replace(".tsx", ""))
}

export function getComponentDocumentation(componentName: string) {
    return docgen.parse(path.resolve(componentsPath, `${componentName}.tsx`), { savePropValueAsString: true })
}
