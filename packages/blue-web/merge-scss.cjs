#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

if (process.argv.length < 3) {
    console.error("❌ Bitte eine SCSS-Datei angeben! Beispiel:")
    console.error("   node merge-scss.js input.scss")
    process.exit(1)
}

const entryFile = path.resolve(process.argv[2]) // Erste CLI-Argument als SCSS-Datei
if (!fs.existsSync(entryFile)) {
    console.error(`❌ Datei nicht gefunden: ${entryFile}`)
    process.exit(1)
}

console.log(`🔍 SCSS-Merge gestartet für: ${entryFile}`)

/**
 * Funktion zum rekursiven Auflösen von `@import`-Anweisungen
 * @param {string} filePath - Der aktuelle SCSS-Dateipfad
 * @param {Set<string>} processedFiles - Verarbeitete Dateien (zur Vermeidung von Duplikaten)
 * @returns {string} - Der zusammengeführte SCSS-String
 */
function mergeSCSS(filePath, processedFiles = new Set()) {
    if (processedFiles.has(filePath)) return "" // Verhindert doppelte Importe
    processedFiles.add(filePath)

    let scssContent = fs.readFileSync(filePath, "utf-8")
    let scssDir = path.dirname(filePath)

    // Ersetze `@import "datei";` durch den Inhalt der Datei
    scssContent = scssContent.replace(/@import ["'](.+?)["'];/g, (_, importPath) => {
        if (importPath.startsWith("node_modules")) {
            importPath = path.resolve(__dirname, importPath)
        }

        let normalizedPath = path.normalize(importPath)

        let standardPath = path.resolve(scssDir, normalizedPath + ".scss")
        let partialPath = path.join(path.dirname(standardPath), "_" + path.basename(standardPath))
        let standardCssPath = path.resolve(scssDir, normalizedPath + ".css")
        let partialCssPath = path.join(path.dirname(standardPath), "_" + path.basename(standardCssPath))

        if (fs.existsSync(standardPath)) {
            return mergeSCSS(standardPath, processedFiles)
        } else if (fs.existsSync(partialPath)) {
            return mergeSCSS(partialPath, processedFiles)
        } else if (fs.existsSync(standardCssPath)) {
            return mergeSCSS(standardCssPath, processedFiles)
        } else if (fs.existsSync(partialCssPath)) {
            return mergeSCSS(partialCssPath, processedFiles)
        }

        console.warn(`⚠️ Datei nicht gefunden: ${importPath}`)
        return `/* Datei nicht gefunden: ${importPath} */`
    })

    return scssContent
}

// 🔄 SCSS zusammenführen
const mergedSCSS = mergeSCSS(entryFile)

// Name für die Ausgabe bestimmen
const outputFile = path.join(path.dirname(entryFile), "merged.scss")
fs.writeFileSync(outputFile, mergedSCSS)
console.log(`✅ SCSS-Dateien erfolgreich zusammengeführt -> ${outputFile}`)
