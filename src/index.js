import koa from 'koa'
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

const app = new koa()

const isDevMode = process.env.NODE_ENV !== 'production'

// jwt的使用方式2 这个包只拥有jwt鉴权的功能,但是生成token还需要另外一个库 jsonwebtoken
const unlessPath = [
  /^\/public/,
  '/getCaptcha',
  '/reg',
  '/getPostList',
  '/login'
]

const JWT =
  jwt({ secret: config.jwtSecret }).unless({ path: unlessPath })

const middleware = koaCompose([
  koaBody(),
  statics(path.join(__dirname, '../public')),
  cors(),
  koaJson({
    pretty: false,
    param: 'pretty',
  }),
  helmet(),
  router(),
  errorHandle,
  JWT,
])

// 不是开发环境, 压缩中间件
if (!isDevMode) {
  app.use(koaCompress())
}

app.use(middleware)

let port = isDevMode ? 3000 : 12005

app.listen(port, () => {
  console.log(`The server is running at: ${ port }`)
})
