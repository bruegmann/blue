// @ts-nocheck
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import remarkRender from "./src/plugins/remark-render.mjs"

import fs from "fs"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const readmeFilePath = path.join(__dirname, "../README.md")
const directories = ["src/pages"]
const llmsTxtOutput = path.join(__dirname, "public/llms.txt")
const searchIndexOutput = path.join(__dirname, "public/search-index.json")

function readPages(dir) {
    return fs
        .readdirSync(path.resolve(__dirname, "src/pages", dir))
        .map((f) => `${dir}/${encodeURIComponent(f.replace(".astro", "").replace(".mdx", "").replace(".md", ""))}`)
}

function readMDXFiles(dir) {
    const files = fs.readdirSync(dir)
    let content = ""

    files.forEach((file) => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            content += readMDXFiles(filePath) // Rekursion für Unterverzeichnisse
        } else if (file.endsWith(".mdx")) {
            let fileContent = fs.readFileSync(filePath, "utf-8") + "\n" // Inhalt hinzufügen

            fileContent = fileContent
                .replace(/^---[\s\S]*?---\s*/, "")
                .replace(`import RenderBlock from "$/components/RenderBlock.astro"`, "")
                .replace(/ use:RenderBlock/g, "")
                .replace(`import Grab from "$/components/Grab.astro"`, "")
                // Entfernt alle Grab-Komponenten-Aufrufe (auch mit beliebigen Props/Inhalt)
                .replace(/<Grab[\s\S]*?\/>/g, "")
                // Überschriften um eine Ebene vertiefen (alle # am Zeilenanfang um eins erhöhen)
                .replace(/^(\s*)(#+)/gm, (_, spaces, hashes) => spaces + "#" + hashes)

            content += fileContent
        }
    })

    return content
}

let allContent = fs.readFileSync(readmeFilePath, "utf-8")

directories.forEach((dir) => {
    const fullPath = path.join(__dirname, dir)
    allContent += readMDXFiles(fullPath)
})

// Schreibe den gesammelten Inhalt in die llms.txt-Datei
fs.writeFileSync(llmsTxtOutput, allContent.trim(), "utf-8")

const searchIndex = [...readPages("css"), ...readPages("js")]
fs.writeFileSync(searchIndexOutput, JSON.stringify(searchIndex), "utf-8")

console.log("llms.txt wurde erfolgreich erstellt!")

// https://astro.build/config
export default defineConfig({
    site: "https://bruegmann.github.io/blue-web/v1/",
    base: "/blue-web/v1/",
    integrations: [react(), mdx()],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: "legacy",
                    includePaths: ["node_modules"]
                }
            }
        }
    },
    markdown: {
        syntaxHighlight: "prism",
        remarkPlugins: [remarkRender]
    }
})
