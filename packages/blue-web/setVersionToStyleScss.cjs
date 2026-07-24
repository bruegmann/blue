const fs = require("fs")
const { version } = require("./package.json")
const filePath = "./dist/style.scss"

let content = fs.readFileSync(filePath, "utf8")
content = content.replace(/Blue Web v(\d+([\.]\d+)*(-(beta|alpha|next)\.(\d+))?)/gm, "Blue Web v" + version)

fs.writeFileSync(filePath, content)
