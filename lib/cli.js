#!/usr/bin/env node
const child_process = require('child_process')
const { deleteFolder, buildFolder } = require("./files")
let { CONFIG } = require("./config")
let { vboga } = require("./core")
let { addToList } = require('./list')
let argvs = process.argv
//console.log(argvs)
const handler = {
    "^build$": () => {
        deleteFolder("./public")
        buildFolder(`./theme/${CONFIG.site.theme}`, './public', console.log)
    },
    "^new$": (v) => {
        let articleType = v[0]
        let articleTitle = v.slice(1).join(" ")
        try {
            addToList(articleTitle, articleType)
            console.log("Added!")
        }
        catch (e) {
            console.log("ERROR:", e)
        }
    },
    "^help$": () => {
        console.log(`VBoga Cli ${vboga.version} HELP
build\tBuild your files
new page/post title\tCreate a page/post, titled title
help\tShow this page
`)
    }
}
const getHandler = (p) => {
    for (let i in handler) {
        if (p.search(new RegExp(i, "g")) !== -1)
            return handler[i]
    }
    return handler["^help$"]
}
if (argvs.length <= 2)
    getHandler("")()
else {
    getHandler(argvs[2])(argvs.slice(3))
}