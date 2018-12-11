// 链接数据库，导出 db Schema
const mongoose = require('mongoose')
const db = mongoose.createConnection("mongodb://localhost:27017/blogproject", {useNewUrlParser: true})

// 用原生es6的 promise 代替 mongoose的
mongoose.Promise = global.Promise

// 把 mongoose 的 Schema 取出来
const Schema = mongoose.Schema


db.on("error", () => {
    console.log('链接数据库失败')
})

db.on("open", () => {
    console.log('连接数据库成功')
})


module.exports = {
    db,
    Schema
}