import Router from '@koa/router'
import ContentController from '@/api/ContentController'

const router = new Router()

router.post('/getPostList', ContentController.getPostList)

export default router
