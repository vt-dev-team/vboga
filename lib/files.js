/**
 * Renderer.js
 * by yemaster
 */

const fs = require("fs")
const { getRenderer } = require("./core")

// 递归删除目录
const deleteFolder = (path) => {
    let files = []
    // 如果目录存在
    if (fs.existsSync(path)) {
        // 读取文件夹内容
        files = fs.readdirSync(path)
        files.forEach(function (file, index) {
            // 每一个文件都删除
            let curPath = path + "/" + file
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath) // 目录递归删除
            } else {
                fs.unlinkSync(curPath) // 文件直接删除
            }
        })
        fs.rmdirSync(path) // 删完后直接删除
    }
}


const buildFolder = (src, dist, callback = console.log) => {
    fs.access(dist, function (err) {
        if (err)
            fs.mkdirSync(dist)
        _copy(null, src, dist)
    })

    function _copy(err, src, dist) {
        if (err) {
            throw err
        } else {
            fs.readdir(src, function (err, paths) {
                if (err) {
                    throw err
                } else {
                    paths.forEach(function (p) {
                        let _src = src + '/' + p
                        let _dist = dist + '/' + p
                        fs.stat(_src, function (err, stat) {
                            if (err) {
                                throw err
                            } else {
                                if (stat.isFile()) {
                                    getRenderer(p)(p, _src, _dist, callback)
                                } else if (stat.isDirectory()) {
                                    buildFolder(_src, _dist, callback)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}

module.exports = { deleteFolder, buildFolder }