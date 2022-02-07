const fs = require("fs")
const path = require("path")
let CONFIG = {}
let THEME = {}
const CONFIG_FILE = path.join(__dirname, '../data/config.json')

try {
    CONFIG = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
}
catch (e) {
    throw e
}
const THEME_FILE = path.join(__dirname, `../theme/${CONFIG.site.theme}/config.json`)
if (fs.existsSync(THEME_FILE))
    THEME = JSON.parse(fs.readFileSync(THEME_FILE, 'utf-8'))
module.exports = { CONFIG, THEME }