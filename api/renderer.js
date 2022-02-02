/**
 * Renderer.js
 * by yemaster
 */

const fs = require("fs")
const path = require('path')
const ejs = require("ejs")
const { getList, getPost } = require("./list")

const PostList = getList()

PostList.forEach((v) => { v["link"] = `posts/${v.file}.html` })

const deleteFolder = (path) => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

const copyDir = (src, dist, callback) => {
    fs.access(dist, function (err) {
        if (err) {
            // 目录不存在时创建目录
            fs.mkdirSync(dist);
        }
        _copy(null, src, dist);
    });

    function _copy(err, src, dist) {
        if (err) {
            callback(err);
        } else {
            fs.readdir(src, function (err, paths) {
                if (err) {
                    callback(err)
                } else {
                    paths.forEach(function (p) {
                        var _src = src + '/' + p;
                        var _dist = dist + '/' + p;
                        fs.stat(_src, function (err, stat) {
                            if (err) {
                                callback(err);
                            } else {
                                // 判断是文件还是目录
                                if (stat.isFile()) {
                                    let fileContent = fs.readFileSync(_src).toString()
                                    if (p === "post.html") {
                                        fs.mkdirSync("./public/posts", true)
                                        for (let i in PostList) {
                                            let p = getPost(PostList[i].title)
                                            ejs.renderFile(`./theme/${CONFIG.site.theme}/post.html`, {
                                                CONFIG: CONFIG,
                                                POST: p
                                            }, (err, data) => {
                                                if (err)
                                                    throw err
                                                fs.writeFileSync(`./public/posts/${p.file}.html`, data)
                                            })
                                        }
                                    }
                                    else {
                                        if (path.extname(_src) === ".html") {
                                            fileContent = ejs.render(fileContent, {
                                                CONFIG: CONFIG,
                                                POSTS: PostList
                                            })
                                        }
                                        fs.writeFileSync(_dist, fileContent)
                                    }
                                } else if (stat.isDirectory()) {
                                    // 当是目录是，递归复制
                                    copyDir(_src, _dist, callback)
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
let CONFIG = {}
try {
    CONFIG = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'))
}
catch (e) {
    throw e
}
copyDir(`./theme/${CONFIG.site.theme}`, './public', err => {
    throw err
})