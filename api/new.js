let argvs = process.argv
if (argvs.length < 4)
    throw "请输入文章标题"
let articleType = argvs[2]
if (["post", "page"].indexOf(articleType) === -1)
    throw "文章类型只能是 post 或者 page"
let articleTitle = argvs.slice(3).join(" ")

const addPost = (t) => {
    let { isInList, addToList } = require('./list')
    let newArticle = {
        "title": t,
        "category": ["未分类"],
        "type": articleType,
        "date": new Date().getTime()
    }
    if (isInList(newArticle))
        throw "文章已经存在"
    else
        addToList(newArticle)
}
addPost(articleTitle)