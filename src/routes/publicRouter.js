import Router from '@koa/router'
import PublicController from '@/api/PublicController'
import ContentController from '@/api/ContentController'

const router = new Router()

// router.prefix('/public')

// 获取验证码
router.get('/getCaptcha', PublicController.getCaptcha)

export default router
