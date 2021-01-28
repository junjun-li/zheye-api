import Router from '@koa/router'
import ContentController from '@/api/ContentController'

const router = new Router()

router.get('/getPostList', ContentController.getPostList)

router.post('/uploadImg', ContentController.uploadImg)

export default router
