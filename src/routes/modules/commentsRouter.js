import Router from '@koa/router'
import CommentsController from '@/api/CommentsController'

const router = new Router()

router.get('/getComments', CommentsController.getComments)

router.post('/addComment', CommentsController.addComment)

router.get('/setCommentBest', CommentsController.setCommentBest)

router.get('/setLink', CommentsController.setLink)

export default router
