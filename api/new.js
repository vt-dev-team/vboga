let argvs = process.argv
if (argvs.length < 3)
    throw "请输入文章标题"
let articleTitle = argvs[2]
console.log(articleTitle)

const addPost = (t) => {
    let { isInList, addToList } = require('./list')
    if (isInList(t))
        throw "文章已经存在"
    else {
        let newArticle = {
            "title": t,
            "category": ["未分类"],
            "date": new Date().getTime()
        }
        addToList(newArticle)
    }
}
addPost(articleTitle)