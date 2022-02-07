# vboga
A blog system

## 更新日志

- v0.0.3
  - 支持cli和直接引入
  - 支持自定义渲染方式

- v0.0.2
  - 支持自定义链接
  - 支持include函数
  - 支持主题设置config.json

- v0.0.1
  - 支持markdown文档
  - 支持多主题

## 原装程序清单

```
├─api            #用于存放命令文件
|  ├─build.js    #用于构建public文件夹
|  ├─config.js   #用于设置文件的读取
|  ├─list.js     #用于文章列表的读取和操作
|  └─core.js     #用于存放核心函数
├─data           #用于存放数据文件
│  └─config.json #用于存放设置
└─theme          #用于存放主题文件
   ├─dlyner      #默认主题
   └─emptiness   #最初的主题，已经弃用
```

## 目录


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

     链接中 `{file}` 会自动解析为文件名，`{title}` 会自动解析为标题

     如果文件名不合法，将自动保存为 `/{type}s/{file}`，`{type}` 为文章类型(post/page)。

     文章只能保存在 pages 或者 posts 或者根目录中

2.   主题编写说明

     自带两个主题：dlyner和emptiness，可做参考。

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

3.   主题安装说明

     要想安装一个主题，下载解压到themes目录，然后设置data/config.json即可。