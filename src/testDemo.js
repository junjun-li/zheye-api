"use strict";
exports.__esModule = true;
var koa = require("koa");
var Router = require("koa-router");
var app = new koa();
var router = new Router();
router.get('/', function (ctx, next) {
    ctx.body = {
        msg: 'hello koa js'
    };
});
router.get('/cat', function (ctx, next) {
    ctx.body = {
        msg: 'hello cat'
    };
});
router.get('/dog', function (ctx, next) {
    ctx.body = {
        msg: 'hello dog'
    };
});
app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(3000, function () {
    console.log('3000端口');
});
