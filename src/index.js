import Koa from 'koa'
import cors from '@koa/cors' // 解决跨域
import helmet from 'koa-helmet' // 请求头
import statics from 'koa-static'
import path from 'path'
import koaBody from 'koa-body'
import koaJson from 'koa-json'
import koaCompose from 'koa-compose'
import koaCompress from 'koa-compress' // 压缩中间件
import jwt from 'koa-jwt'
import errorHandle from '@/common/errorHandle'
import router from './routes/routes'
import config from '@/config'

const app = new Koa()

const isDevMode = process.env.NODE_ENV !== 'production'

// jwt的使用方式2 这个包只拥有jwt鉴权的功能,但是生成token还需要另外一个库 jsonwebtoken
// todo 路由权限设置一下
const unlessPath = [
  /^\/public/,
  '/getCaptcha',
  '/reg',
  '/getPostList',
  '/login'
]

const JWT = jwt({ secret: config.jwtSecret }).unless({ path: unlessPath })
const middleware = koaCompose([
  koaBody({
    multipart: true, // 让koa-body可以收到formDate的数据
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 5 * 1024 * 1024
    },
    onError: err => {
      console.log('koaBody TCL: err', err)
    }
  }),
  statics(path.join(__dirname, '../public')),
  cors(),
  koaJson({
    pretty: false,
    param: 'pretty'
  }),
  helmet(),
  errorHandle,
  // jwt的坑, 先试用jwt, 在注册路由
  JWT,
  router()
])

// 不是开发环境, 压缩中间件
if (!isDevMode) {
  app.use(koaCompress())
}

app.use(middleware)

// app.use(router())

let port = isDevMode ? 12005 : 12005

app.listen(port, () => {
  console.log(`The server is running at: ${port}`)
})
