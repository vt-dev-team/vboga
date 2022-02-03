const http = require("http")
const path = require('path')
const fs = require('fs')

const hostname = '127.0.0.1'
const port = 3000

let server = http.createServer(function (req, res) {
    fs.createReadStream(path.resolve(__dirname, "." + req.url)).pipe(res);
}).listen(port)