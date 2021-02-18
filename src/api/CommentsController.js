import CommentModel from '@/model/CommentModel'
import {
  checkCode,
  getJWTPayload
} from '@/common/utils'
import PostModel from '@/model/PostModel'
import UserModel from '@/model/UserModel'
import CommentsHandsModel from '@/model/CommentHandsModel'

class CommentsController {
  // 获取评论列表
  async getComments (ctx) {
    const { id, page, pageSize } = ctx.query
    let result = await CommentModel.findCommentsById({
      id,
      page,
      pageSize: parseInt(pageSize)
    })
    // 判断用户是否登录，已登录的用户才去判断点赞信息
    let obj = {}
    if (typeof ctx.header.authorization !== 'undefined') {
      obj = await getJWTPayload(ctx.header.authorization)
    }
    if (typeof obj._id !== 'undefined') {
      result = result.map(item => item.toJSON())
      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        item.handed = '0'
        const commentsHands = await CommentsHandsModel.findOne(
          {
            cid: item._id,
            uid: obj._id
          }
        )
        if (commentsHands && commentsHands.cid) {
          if (commentsHands.uid === obj._id) {
            item.handed = '1'
          }
        }
      }
    }

    const total = await CommentModel.queryCount(id)
    ctx.body = {
      code: 0,
      data: {
        total,
        rows: result
      },
      msg: '查询成功'
    }
  }

  // 发表评论
  async addComment (ctx) {
    const { body } = ctx.request
    const { content, code, sid } = body

    const obj = await getJWTPayload(ctx.header.authorization)
    const user = await UserModel.findByID(obj._id)
    if (user.status !== '0') {
      ctx.body = {
        code: 1,
        msg: '用户已被禁言, 请联系管理员'
      }
      return
    }

    const result = await checkCode(sid, code)
    if (!result) {
      ctx.body = {
        code: 1,
        msg: '验证码错误'
      }
      return
    }
    const newComment = new CommentModel(body)
    newComment.uid = obj._id
    const res = await newComment.save()

    // 评论数 +1
    const post = await PostModel.updateOne(
      { _id: body.tid },
      {
        $inc: {
          answer: 1
        }
      }
    )
    if (post.ok === 1) {
      ctx.body = {
        code: 0,
        data: res,
        msg: '操作成功'
      }
    } else {
      ctx.body = {
        code: 1,
        data: res,
        msg: '操作失败'
      }
    }
  }

  // 采纳回答, 结贴
  async setCommentBest (ctx) {
    const { cid, tid } = ctx.query
    const userInfo = await getJWTPayload(ctx.header.authorization)
    const post = await PostModel.findOne({ _id: tid })
    if (post.uid === userInfo._id && post.isEnd === '0') {
      // 说明这是作者本人，可以去设置isBest
      const result1 = await PostModel.updateOne(
        { _id: tid },
        {
          $set: {
            // 是否结贴
            isEnd: '1'
          }
        }
      )
      const result2 = await CommentModel.updateOne(
        { _id: cid },
        {
          // 是否采纳，0-否，1-是
          $set: {
            isBest: '1'
          }
        }
      )
      // 发布者减少积分
      // 回帖者增加积分
      if (result1.ok === 1 && result2.ok === 1) {
        // 根据回帖id查询回帖的信息
        const commentInfo = await CommentModel.findByCid(cid)
        const result3 = await UserModel.updateOne(
          { _id: commentInfo.uid },
          // 扣除积分
          { $inc: { integral: parseInt(post.integral) } }
        )
        console.log(result3)
        ctx.body = {
          code: 0,
          msg: '操作成功'
        }
      }
      else {
        ctx.body = {
          code: 1,
          msg: '操作失败, 请联系管理员'
        }
      }
    }
    else {
      ctx.body = {
        code: 0,
        msg: '帖子已结贴，无法重复设置'
      }
    }
  }

  // 点赞
  async setLink (ctx) {
    const userInfo = await getJWTPayload(ctx.header.authorization)
    const query = ctx.query
    // 判断用户是否已经点赞
    const tmp = await CommentsHandsModel.find(
      {
        cid: query.cid,
        uid: userInfo._id
      }
    )
    if (tmp.length > 0) {
      ctx.body = {
        code: 1,
        msg: '您已经点赞，请勿重复点赞'
      }
      return
    }
    // 新增一条点赞记录
    const newHands = new CommentsHandsModel({
      cid: query.cid,
      uid: userInfo._id
    })
    const data = await newHands.save()

    // 更新comments表中对应的记录的hands信息 +1
    const result = await CommentModel.updateOne(
      { _id: query.cid },
      {
        $inc: {
          hands: 1
        }
      }
    )
    if (result.ok === 1) {
      ctx.body = {
        code: 0,
        msg: '点赞成功',
        data: data
      }
    }
    else {
      ctx.body = {
        code: 1,
        msg: '保存点赞记录失败！'
      }
    }
  }
}

export default new CommentsController()
