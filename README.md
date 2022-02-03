# vboga
A blog system

## 用法

1.   新建文章或者新建页面

     ```base
     yarn new page "balabala"
     yarn new post "balabala"
     ```

     事实上，这两者是完全等同的，只是记录的type不一样而已

2.   编译渲染

     ```bash
     yarn build
     ```

     然后目录下的public即为打包好的文件。

3.   更改主题

     下载主题解压到theme文件夹，然后编辑/data/config.json启用主题。

## 说明

1.   config.json说明

     ```json
     {
         "site": {
             "title": "orz bossbaby", /* 站点标题 */
             "subtitle": "bossbaby真的是太强了",/* 站点副标题 */
             "theme": "emptiness" /* 主题 */
         },
         "link": {
             "post": "posts/orz-{file}", /* 文章的链接 */
             "page": "{title}" /* 页面的链接 */
         }
     }
     ```

     链接中 {file} 会自动解析为文件名，{title} 会自动解析为标题

     如果文件名不合法，将自动保存为 /{type}s/{file}，{type} 为文章类型(post/page)。

     文章只能保存在 pages 或者 posts 或者根目录中

2.   主题编写说明

     默认主题 emptiness

     主题采用ejs模板引擎

     -   config.json用于存储主题的设置，不会被复制

     -   非html的文件将被直接复制

     -   post.html和page.html将会被用于渲染文章列表和页面。

         当然如果这两个文件不存在也就不会渲染相应的内容了。

         渲染时传入3个参数：

         -   CONFIG: 站点的设置(/data/config.json的内容)

         -   THEME: 主题的设置(/theme/***/config.json的内容)

         -   POSTS: 文章的信息

             ```json
             {
                     "title": "文章标题",
                     "category": [
                         "分类，是个数组"
                     ],
                     "type": "文章类型，post或page",
                     "date": "日期，YYYY-MM-DD HH:mm:ss",
                     "file": "存储的文件名",
                 	"content": "文章内容，已解析成html"
             }
             ```

     -   其他html文件

         渲染时传入3个参数

         -   CONFIG

         -   THEME
         -   POSTS: 列表，post类型的文章。比上面少content，多link(链接地址)
