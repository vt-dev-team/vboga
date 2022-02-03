/**
 * Renderer.js
 * by yemaster
 */

const fs = require("fs")
const path = require('path')
const ejs = require("ejs")
const { getList, getPost } = require("./list")

const deleteFolder = (path) => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path)
        files.forEach(function (file, index) {
            let curPath = path + "/" + file
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path);
    }
}

const buildDir = (src, dist, callback) => {
    fs.access(dist, function (err) {
        if (err) {
            fs.mkdirSync(dist)
        }
        _copy(null, src, dist)
    })

    function _copy(err, src, dist) {
        if (err) {
            callback(err);
        } else {
            fs.readdir(src, function (err, paths) {
                if (err) {
                    callback(err)
                } else {
                    paths.forEach(function (p) {
                        var _src = src + '/' + p
                        var _dist = dist + '/' + p
                        if (p === "config.json")
                            return
                        fs.stat(_src, function (err, stat) {
                            if (err) {
                                callback(err)
                            } else {
                                if (stat.isFile()) {
                                    let fileContent = fs.readFileSync(_src)
                                    if (p === "post.html" || p === "page.html") {
                                        fs.mkdirSync(`./public/${p.substring(0, p.lastIndexOf("."))}s`, true)
                                        for (let i in PostList) {
                                            let postView = getPost(PostList[i])
                                            let toFileName
                                            if (postView.type + '.html' !== p)
                                                continue
                                            ejs.renderFile(`./theme/${CONFIG.site.theme}/${p}`, {
                                                CONFIG: CONFIG,
                                                THEME: THEME,
                                                POST: postView
                                            }, (err, data) => {
                                                if (err)
                                                    throw err
                                                try {
                                                    toFileName = CONFIG.link[postView.type]
                                                    toFileName = toFileName.replace(/\{title\}/g, postView.title).replace(/\{file\}/g, postView.file)
                                                    toFileName = './public/' + toFileName + '.html'
                                                    fs.writeFileSync(toFileName, data)
                                                    console.log(`Render:\t ${_src} => ${toFileName}`)
                                                }
                                                catch (e) {
                                                    console.log(`Failed to save ${toFileName}(${e})`)
                                                    fs.writeFileSync(`./public/${postView.type}s/${postView.file}.html`, data)
                                                    console.log(`Render:\t ${_src} => ./public/${postView.type}s/${postView.file}.html`)
                                                }
                                            })
                                        }
                                    }
                                    else {
                                        if (path.extname(_src) === ".html") {
                                            ejs.renderFile(_src, {
                                                CONFIG: CONFIG,
                                                THEME: THEME,
                                                POSTS: PostList.filter((v) => {
                                                    return v["type"] === "post"
                                                })
                                            }, (err, data) => {
                                                if (err)
                                                    throw err
                                                console.log(`Render:\t ${_src} => ${_dist}`)
                                                fs.writeFileSync(_dist, data)
                                            })
                                        }
                                        else {
                                            console.log(`Copy:\t ${_src} => ${_dist}`)
                                            fs.writeFileSync(_dist, fileContent)
                                        }
                                    }
                                } else if (stat.isDirectory()) {
                                    buildDir(_src, _dist, callback)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}

deleteFolder("./public")

let PostList = getList()
let CONFIG = {}
let THEME = {}

try {
    CONFIG = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'))
    if (fs.existsSync(`./theme/${CONFIG.site.theme}/config.json`))
        THEME = JSON.parse(fs.readFileSync(`./theme/${CONFIG.site.theme}/config.json`, 'utf-8'))
}
catch (e) {
    throw e
}

PostList.forEach((v) => {
    toFileName = CONFIG.link[v.type]
    toFileName = toFileName.replace(/\{title\}/g, v.title).replace(/\{file\}/g, v.file)
    v["link"] = `/${toFileName}.html`
})

buildDir(`./theme/${CONFIG.site.theme}`, './public', err => {
    throw err
})