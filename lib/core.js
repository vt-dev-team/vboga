/**
 * core.js
 */

const fs = require("fs")
const path = require('path')
const ejs = require("ejs")
const { getList, getPost, decorate_item, decorate_list, parse_item } = require("./list")
let { CONFIG, THEME } = require("./config")
let PostList = decorate_list(getList())

const vboga = {
    version: "0.0.3",
    author: "yemaster"
}

const mkdirPath = (pathStr) => {
    pathStr = pathStr.replace(/\//g, "\\")
    let projectPath = path.join(process.cwd())
    let tempDirArray = pathStr.split('\\')
    tempDirArray.pop()
    for (let i in tempDirArray) {
        projectPath = projectPath + '/' + tempDirArray[i]
        if (fs.existsSync(projectPath)) {
            let tempstats = fs.statSync(projectPath)
            if (!(tempstats.isDirectory())) {
                fs.unlinkSync(projectPath)
                fs.mkdirSync(projectPath)
            }
        }
        else
            fs.mkdirSync(projectPath)
    }
    return projectPath
}

const defaultPRenderer = (p, _src, _dist, callback) => {
    for (let i in PostList) {
        let postView = parse_item(decorate_item(getPost(PostList[i])))
        let toFileName = `./public${postView.link}`
        if (postView.type !== p.substring(0, p.lastIndexOf(".")))
            continue
        ejs.renderFile(`./theme/${CONFIG.site.theme}/${p}`, {
            CONFIG: CONFIG,
            THEME: THEME,
            POST: postView
        }, (err, data) => {
            if (err)
                throw err
            try {
                mkdirPath(toFileName)
                fs.writeFileSync(toFileName, data)
                callback(`Render:\t ${_src} => ${toFileName}`)
            }
            catch (e) {
                callback(`Failed to save ${toFileName}(${e})`)
                fs.writeFileSync(`./public/${postView.type}s/${postView.file}.html`, data)
                callback(`Render:\t ${_src} => ./public/${postView.type}s/${postView.file}.html`)
            }
        })
    }
}

let Core_Config = {
    "renderer": {
        "^post\\.htm(l?)$": defaultPRenderer,
        "^page\\.htm(l?)$": defaultPRenderer,
        "^(\\S*)\\.htm(l?)$": (p, _src, _dist, callback) => {
            ejs.renderFile(_src, {
                CONFIG: CONFIG,
                THEME: THEME,
                POSTS: PostList.filter((v) => {
                    return v["type"] === "post"
                })
            }, (err, data) => {
                if (err)
                    throw err
                callback(`Render:\t ${_src} => ${_dist}`)
                fs.writeFileSync(_dist, data)
            })
        },
        "^config\\.json$": (p, _src, _dist, callback) => {
            callback(`Skip:\t ${_src}`)
        },
        "default": (p, _src, _dist, callback) => {
            let fileContent = fs.readFileSync(_src)
            callback(`Copy:\t ${_src} => ${_dist}`)
            fs.writeFileSync(_dist, fileContent)
        }
    }
}
const getRenderer = (p) => {
    for (let i in Core_Config.renderer) {
        if (p.search(new RegExp(i, "g")) !== -1)
            return Core_Config.renderer[i]
    }
    return Core_Config.renderer.default
}
module.exports = { vboga, CONFIG, THEME, Core_Config, getRenderer }