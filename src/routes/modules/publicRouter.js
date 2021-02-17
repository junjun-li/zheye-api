import Router from '@koa/router'
import PublicController from '@/api/PublicController'
import ContentController from '@/api/ContentController'

const router = new Router()

// router.prefix('/public')

// 获取验证码
router.get('/getCaptcha', PublicController.getCaptcha)

// 获取友情链接
router.get('/getLinks', PublicController.getLinks)

// 获取温馨提醒
router.get('/getTips', PublicController.getTips)

// 获取本周热议
router.get('/getTopWeek', PublicController.getTopWeek)

export default router
