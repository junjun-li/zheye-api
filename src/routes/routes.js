import combineRouters from 'koa-combine-routers'

import publicRouter from '@/routes/publicRouter'
import loginRouter from '@/routes/loginRouter'
import ContentRouter from '@/routes/ContentRouter'
export default combineRouters(
  loginRouter,
  publicRouter,
  ContentRouter
)
