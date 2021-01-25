import combineRouters from 'koa-combine-routers'

import publicRouter from '@/routes/publicRouter'
import loginRouter from '@/routes/loginRouter'
import contentRouter from '@/routes/contentRouter'
import userRouter from '@/routes/userRouter'

export default combineRouters(
  loginRouter,
  publicRouter,
  contentRouter,
  userRouter
)
