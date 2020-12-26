import koa from 'koa'
import cors from '@koa/cors' // 解决跨域
import helmet from 'koa-helmet' // 请求头
import statics from 'koa-static'
import path from 'path'
import koaBody from 'koa-body'
import koaJson from 'koa-json'
import koaCompose from 'koa-compose'
import koaCompress from 'koa-compress' // 压缩中间件
import router from './routes/routes'

const app = new koa()

const isDevMode = process.env.NODE_ENV === 'production' ? false : true

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
])

// 不是开发环境, 压缩中间件
if (!isDevMode) {
  app.use(koaCompress())
}

app.use(middleware)

app.listen(3000, () => {
  console.log('3000端口')
})
