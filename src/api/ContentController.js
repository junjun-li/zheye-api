import PostModel from '@/model/PostModel'
import LinkModel from '@/model/LinkModel'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import makeDir from 'make-dir'

import config from '@/config'
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

  // 友情链接
  async getLinks (ctx) {
    // title: { type: String },
    // link: { type: String, default: 'link' },
    // created: { type: Number },
    // isTop: { type: String },
    // sort: { type: String },
    // type: '
    // const linkTest = new LinkModel({
    //   title: '慕课网',
    //   link: 'www.imooc.com',
    //   type: 'link',
    //   isTop: '1',
    //   sort: '0'
    // })
    // const tmp = await linkTest.save()
    let result = await LinkModel.find({ type: 'link' })
    ctx.body = {
      code: 0,
      data: result,
      msg: '操作成功'
    }
  }

  // 温馨通道
  async getTips (ctx) {
    // const linkTest = new LinkModel({
    //   title: 'jenkins',
    //   link: 'http://121.37.183.14:11005/',
    //   type: 'tip',
    //   isTop: '0',
    //   sort: '0'
    // })
    // const tmp = await linkTest.save()
    let result = await LinkModel.find({ type: 'tip' })
    ctx.body = {
      code: 0,
      data: result,
      msg: '操作成功'
    }
  }

  // 获取本周热议
  async getTopWeek (ctx) {
    const res = await PostModel.getTopWeek()
    ctx.body = {
      code: 0,
      data: res,
      msg: '操作成功'
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
}

export default new ContentController()
