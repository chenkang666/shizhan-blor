const Router = require('koa-router')

// 拿到user 表的操作权
const user = require('../control/user')

const router = new Router

// 设计主页
router.get("/",user.keepLog, async (ctx) => {
    await ctx.render("index", {
        title: "假装着是以后"
    }),{
        session: {
            role: 666
        }
    }
})

router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
    // show 为true ， 显示注册，否则显示 登录
    const show = /reg$/.test(ctx.path)

    await ctx.render("register", {show})

})

// 登录用户
router.post('/user/login', user.login)

// 注册用户
router.post('/user/reg',user.reg)

module.exports = router