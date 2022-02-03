const fs = require('fs')
const moment = require('moment')
const showdown = require('showdown')

const getList = () => {
    let blogList = []
    try {
        blogList = JSON.parse(fs.readFileSync('./data/list.json', 'utf-8'))
    }
    catch (e) {
        if (e.code === "ENOENT") {
            fs.writeFileSync('./data/list.json', JSON.stringify([]))
        }
        else
            throw e
    }
    blogList.forEach((v) => {
        v["date"] = moment(v["date"]).format("YYYY-MM-DD HH:mm:ss")
    })
    return blogList
}
const randomString = (l) => {
    let c = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let res = ''
    for (let i = 0; i < l; ++i)
        res += c[Math.floor(Math.random() * c.length)]
    return res
}
const isInList = (q) => {
    let l = getList()
    for (let i in l) {
        if (l[i].title === q.title && l[i].type === q.type)
            return l[i]
    }
    return false
}
const checkArticle = (o) => {
    if (typeof o !== "object")
        return false
    return o.hasOwnProperty("title") &&
        o.hasOwnProperty("category") &&
        o.hasOwnProperty("date") &&
        o.hasOwnProperty("type")
}
const addToList = (o) => {
    let l = getList()
    if (!checkArticle(o))
        throw "格式不合法"
    if (!fs.existsSync('./data/posts'))
        fs.mkdirSync('./data/posts')
    fs.accessSync("./data/posts/")
    let fileName = randomString(12)
    while (fs.existsSync(`./data/posts/${fileName}.md`))
        fileName = randomString(12)
    o["file"] = fileName
    l.push(o)
    fs.writeFileSync('./data/list.json', JSON.stringify(l))
    fs.writeFileSync(`./data/posts/${fileName}.md`, `# ${o["title"]}`)
}
const converter = new showdown.Converter()
const getPost = (t) => {
    let l = getList()
    let p = isInList(t)
    if (p == false)
        throw `找不到文章${t.title}`
    if (!fs.existsSync(`./data/posts/${p.file}.md`))
        throw 'md文件不存在'
    p["content"] = converter.makeHtml(fs.readFileSync(`./data/posts/${p.file}.md`).toString())
    return p
}
module.exports = { getList, isInList, addToList, getPost }