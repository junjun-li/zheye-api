import Router from '@koa/router'
import ContentController from '@/api/ContentController'

const router = new Router()

router.get('/getPostList', ContentController.getPostList)

router.post('/uploadImg', ContentController.uploadImg)

router.post('/add', ContentController.addPost)

router.get('/getPostDetail', ContentController.getPostDetail)

export default router
