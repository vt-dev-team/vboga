/**
 * VBoga
 * A Simple Blog System
 * by yemaster
 */

let list = require("./list")
let core = require("./core")
let files = require("./files")
let renderer = requrie("./renderer")
module.exports = { version: core.version, list, core, files, renderer }