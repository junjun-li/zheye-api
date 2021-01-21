import svgCaptcha from 'svg-captcha'
import {
  setValue,
  getValue,
  getHMValue,
  delValue
} from '@/config/RedisConfig'

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
}

export default new PublicController()
