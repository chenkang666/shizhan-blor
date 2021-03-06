const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')
const encrypt = require('../util/crypt')
// 通过 db 对象创建操作user数据库的模型对象
const User = db.model("users", UserSchema)


// 用户注册 路由
exports.reg = async ctx => {
    // 用户注册时 post发送的数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    // 注册时，
    // 1、去数据库 user 查询当前发送的username是否存在

    await new Promise((resolve, reject) => {
        User.find({ username }, (err, data) => {
            if (err) return reject(err)
            // 查询没出错，还有可能没有数据
            if (data.length !== 0) {
                // 查询到了，用户名已存在
                return resolve("")
            }
            // 未查询到，用户名不存在，可注册
            // 保存之前先加密
            const _user = new User({
                username,
                password: encrypt(password)
            })
            _user.save((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    })
        .then(async data => {
            if (data) {
                // 注册成功
                await ctx.render("isOk", {
                    status: "注册成功"
                })
            } else {
                // 用户名已存在
                await ctx.render("isOk", {
                    status: "用户名已存在"
                })
            }
        })
        .catch(async err => {
            await ctx.render("isOk", {
                status: "注册失败，请重试"
            })
        })
}

exports.login = async ctx => {
    // 拿到post数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password

    await new Promise((resolve, reject) => {
        User.find({ username }, (err, data) => {
            if (err) return reject(err)
            if (data.length === 0) return reject('用户名不存在')

            // 把用户传过来的密码加密后与数据库里进行比对
            if (data[0].password === encrypt(password)) {
                return resolve(data)
            }
            resolve("")
        })
    })
    .then(async data => {
        if (!data) {
            return ctx.render("isOk", {
                status: "密码不正确，登录失败"
            })
        }
        await ctx.render("isOk", {
            status: "登录成功"
        })
    })
    .catch(async err => {
        if(!err){
            await ctx.render("isOk", {
                status: "登录失败"
            })
        }
        await ctx.render("isOk", {
            status: err
        })
        
    })
}