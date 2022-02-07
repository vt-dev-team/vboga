#!/usr/bin/env node
const path = require("path")
const child_process = require('child_process')
const simpleGit = require('simple-git')
const git = simpleGit(path.join(__dirname, "../public"))
let moment = require("moment")
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
    "^deploy$": async () => {
        try {
            await git.init()
            await git.addRemote('origin', CONFIG.remote.repo)
        }
        catch (e) {
            //console.log("ERROR:", e)
        }
        try {
            await git.add("./*")
            await git.commit(`更新于${moment().format("YYYY-MM-DD HH:ii:ss")}`)
            await git.push(["origin", "master", "-f"])
        }
        catch (e) {
            console.log("ERROR:", e)
        }
        console.log("Finished")
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