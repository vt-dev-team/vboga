const fs = require('fs')
const path = require("path")
const moment = require('moment')
const showdown = require('showdown')
const { CONFIG } = require("./config")
const LIST_FILE = path.join(__dirname, '../data/list.json')
const POST_DIR = path.join(__dirname, '../data/posts/')
// 随机一个字符串
const randomString = (l) => {
    let c = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let res = ''
    for (let i = 0; i < l; ++i)
        res += c[Math.floor(Math.random() * c.length)]
    return res
}
// 获取文章列表
const getList = () => {
    let blogList = []
    if (fs.existsSync(LIST_FILE)) {
        try {
            blogList = JSON.parse(fs.readFileSync(LIST_FILE, 'utf-8'))
        }
        catch (e) {
            throw e
        }
    }
    else
        fs.writeFileSync(LIST_FILE, JSON.stringify([]))
    return blogList
}
// 是否在文章里面了
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
const addToList = (t, tp = "post") => {
    if (["post", "page"].indexOf(tp) === -1)
        throw "文章类型只能是 post 或者 page"
    let o = {
        "title": t,
        "category": ["未分类"],
        "type": tp,
        "date": new Date().getTime()
    }
    if (isInList(o))
        throw "文章已经存在"
    let l = getList()
    if (!checkArticle(o))
        throw "格式不合法"
    if (!fs.existsSync(POST_DIR))
        fs.mkdirSync(POST_DIR)
    let fileName = randomString(12)
    while (fs.existsSync(path.join(POST_DIR, `${fileName}.md`)))
        fileName = randomString(12)
    o["file"] = fileName
    l.push(o)
    fs.writeFileSync(LIST_FILE, JSON.stringify(l))
    fs.writeFileSync(path.join(POST_DIR, `${fileName}.md`), `# ${o["title"]}`)
}
const converter = new showdown.Converter()
const getPost = (t) => {
    let p = isInList(t)
    if (p === false)
        throw `找不到文章${t.title}`
    return p
}
const decorate_item = (p) => {
    toFileName = CONFIG.link[p.type]
    toFileName = toFileName.replace(/\{title\}/g, p.title).replace(/\{file\}/g, p.file)
    p["link"] = `/${toFileName}.html`
    p["date"] = moment(p["date"]).format("YYYY-MM-DD HH:mm:ss")
    return p
}
const parse_item = (p) => {
    let FILE_DIR = path.join(POST_DIR, `${p.file}.md`)
    if (!fs.existsSync(FILE_DIR))
        throw 'md文件不存在'
    p["content"] = converter.makeHtml(fs.readFileSync(FILE_DIR).toString())
    return p
}
const decorate_list = (l) => {
    l.forEach((v) => {
        v = decorate_item(v)
    })
    return l
}
module.exports = { getList, isInList, addToList, getPost, decorate_item, decorate_list, parse_item }