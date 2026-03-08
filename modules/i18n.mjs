import fs from "node:fs"

const i18n = {}

const path = "./public/localization"

const files = fs.readdirSync(path)

for (const file of files) {

    const id = file.replace(".json", "")

    const content = JSON.parse(
        fs.readFileSync(`${path}/${file}`, "utf8")
    )

    i18n[id] = content
}

export default i18n