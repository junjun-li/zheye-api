import svgCaptcha from 'svg-captcha'
import {
  setValue,
  getValue,
  getHMValue,
  delValue
} from '@/config/RedisConfig'
import LinkModel from '@/model/LinkModel'
import PostModel from '@/model/PostModel'

class PublicController {
  async getCaptcha (ctx) {
    const query = ctx.request.query
    const newCaptcha = svgCaptcha.create({
      size: 4, // 验证码长度
      ignoreChars: '0o1il', // 验证码字符中排除 0o1i
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      noise: Math.floor(Math.random() * 5), // 干扰线条的数量
      width: 150,
      height: 38
    })
    // // 设置超时时间, 单位: s
    // // 设置图片验证码超时10分钟
    setValue(query.sid, newCaptcha.text, 10 * 600)
    // // 设置redis 键 值 过期时间 五分钟过期
    ctx.body = {
      code: 0,
      data: newCaptcha,
      msg: '验证码发送成功'
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
    const result = await LinkModel.find({ type: 'link' })
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
    const result = await LinkModel.find({ type: 'tip' })
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
}

export default new PublicController()
