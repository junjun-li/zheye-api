import PostModel from '@/model/PostModel'
import LinkModel from '@/model/LinkModel'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import makeDir from 'make-dir'
import config from '@/config'
import {
  checkCode,
  getJWTPayload
} from '@/common/utils'
import UserModel from '@/model/UserModel'
import CommentModel from '@/model/CommentModel'

class ContentController {
  async getPostList (ctx) {
    const body = ctx.query
    // 测试数据
    // const post = new PostModel({
    //   title: '这是置顶的帖子',
    //   content: '这是置顶的帖子, 这是置顶内容',
    //   catalog: 'advise',
    //   fav: 20,
    //   isEnd: '0',
    //   reads: '0',
    //   answer: '0',
    //   status: '1',
    //   isTop: '0',
    //   sort: '0',
    //   tags: []
    // })
    // const tmp = await post.save()
    // 如果不传, 默认按照创建时间排序
    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}

    if (typeof body.catalog !== 'undefined' && body.catalog !== '') {
      options.catalog = body.catalog
    }
    if (typeof body.isTop !== 'undefined') {
      options.isTop = body.isTop
    }
    if (typeof body.status !== 'undefined' && body.status !== '') {
      options.isEnd = body.status
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      // $elemMatch嵌套查询 筛选一个数组, 需要使用此方法, 筛选某一个字段名称
      options.tags = { $elemMatch: { name: body.tag } }
    }
    const result = await PostModel.getList(options, sort, page, limit)

    ctx.body = {
      code: 0,
      data: result,
      msg: '获取文章列表成功'
    }
  }

  // 上传图片
  async uploadImg (ctx) {
    // ctx.request.files 取得文件
    // append file 文件内容
    const file = ctx.request.files.file
    // 截取后缀名
    const ext = file.name.split('.').pop()

    const dir = `${config.uploadPath}/${moment().format('YYYY-MM-DD')}`
    // 判断路径是否存在, 不存在则创建
    await makeDir(dir)
    // 存储文件到指定路径
    // 给文件一个唯一的名称
    const picName = uuid()
    const destPath = `${dir}/${picName}.${ext}`
    const reader = fs.createReadStream(file.path)
    // const reader = fs.createReadStream(file.path, {
    //   // 每次读取1024字节
    //   highWaterMark: 1 * 1024
    // })
    const upStream = fs.createWriteStream(destPath)
    const filePath = `/${moment().format('YYYY-MM-DD')}/${picName}.${ext}`

    // method 1
    reader.pipe(upStream)

    // method 2 可以监听上传事件

    // 获取文件总长度
    // const stat = fs.statSync(file.path)

    // let totalLength = 0
    // reader.on('data', (chunk) => {
    //   totalLength += chunk.length
    //   if (upStream.write(chunk) === false) {
    //     // 停止读取流
    //     reader.pause()
    //   }
    // })

    // upStream.on('drain', () => {
    //   reader.resume()
    // })

    // reader.on('end', () => {
    //   upStream.end()
    // })
    ctx.body = {
      code: 0,
      msg: '上传成功',
      data: filePath
    }
  }

  // 发帖
  async addPost (ctx) {
    const { body } = ctx.request
    const { sid, code, integral } = body
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (result) {
      const obj = await getJWTPayload(ctx.header.authorization)
      // 判断用户的积分数是否 > fav，否则，提示用户积分不足发贴
      // 用户积分足够的时候，新建Post，减除用户对应的积分
      const user = await UserModel.findByID({ _id: obj._id })
      if (user.integral < integral) {
        ctx.body = {
          code: 1,
          msg: '积分不足'
        }
      }
      else {
        await UserModel.updateOne(
          { _id: obj._id },
          // 扣除积分
          { $inc: { integral: -body.integral } }
        )
      }
      const newPost = await new PostModel(body)
      newPost.uid = obj._id
      const result = await newPost.save()
      ctx.body = {
        code: 0,
        msg: '成功的保存的文章',
        data: result
      }
    }
    else {
      ctx.body = {
        code: 1,
        msg: '图片验证码验证失败'
      }
    }
  }

  // 获取文章详情
  async getPostDetail (ctx) {
    const query = ctx.query
    if (!query.id) {
      ctx.body = {
        code: 1,
        msg: 'id cannot be empty'
      }
    }
    const post = await PostModel.findDetailById(query.id)
    // 更新文章阅读计数
    const res = await PostModel.updateOne(
      { _id: query.id },
      {
        $inc: {
          reads: 1
        }
      }
    )
    ctx.body = {
      code: 0,
      data: post,
      msg: '查询成功'
    }
  }
}

export default new ContentController()
