import Router from '@koa/router'
import UserController from '@/api/UserController'

const router = new Router()

router.prefix('/user')

router.get('/sign', UserController.userSign)

export default router
