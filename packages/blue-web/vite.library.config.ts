import { readdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const packageRoot = dirname(fileURLToPath(import.meta.url))
const sourceDirectory = resolve(packageRoot, "src/js")
const entries = Object.fromEntries(
    readdirSync(sourceDirectory)
        .filter((file) => file.endsWith(".ts"))
        .map((file) => [file.slice(0, -3), resolve(sourceDirectory, file)])
)

export default defineConfig({
    resolve: {
        alias: [{ find: /^(\.\.?\/.+)\.js$/, replacement: "$1.ts" }]
    },
    build: {
        outDir: "dist/js",
        emptyOutDir: false,
        target: "esnext",
        minify: false,
        rolldownOptions: {
            input: entries,
            output: {
                format: "es",
                preserveModules: true,
                preserveModulesRoot: sourceDirectory,
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js"
            }
        }
    }
})

