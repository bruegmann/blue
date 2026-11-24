import { existsSync, readdirSync } from "node:fs"
import { dirname, isAbsolute, relative, resolve, sep } from "node:path"
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
    plugins: [
        {
            name: "blue-web-source-extension",
            enforce: "pre",
            resolveId(source, importer) {
                if (!importer || !source.startsWith(".") || !source.endsWith(".js")) return null

                const importerPath = resolve(importer.split("?")[0])
                const importerRelative = relative(sourceDirectory, importerPath)
                if (
                    importerRelative === ".." ||
                    importerRelative.startsWith(`..${sep}`) ||
                    isAbsolute(importerRelative)
                )
                    return null

                const typescriptPath = resolve(dirname(importerPath), `${source.slice(0, -3)}.ts`)
                const targetRelative = relative(sourceDirectory, typescriptPath)
                if (
                    targetRelative === ".." ||
                    targetRelative.startsWith(`..${sep}`) ||
                    isAbsolute(targetRelative) ||
                    !existsSync(typescriptPath)
                )
                    return null

                return this.resolve(typescriptPath, importer, { skipSelf: true })
            }
        }
    ],
    build: {
        outDir: "dist/js",
        emptyOutDir: false,
        target: "esnext",
        minify: false,
        rolldownOptions: {
            input: entries,
            external: (id) => !id.startsWith(".") && !isAbsolute(id),
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

