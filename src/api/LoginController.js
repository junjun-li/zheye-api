import send from '@/config/MailConfig'
import moment from 'moment'
import { checkCode } from '@/common/utils'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config'
import UserModel from '@/model/UserModel'
import SignRecordModel from '@/model/SignRecordModel'
import bcrypt from 'bcrypt'

class LoginController {
  async forget (ctx) {
    const { body } = ctx.request
    const result = await send({
      code: '1234',
      expire: moment()
        .add(30, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'),
      email: body.username,
      user: 'Brian'
    })

    ctx.body = {
      code: 0,
      data: result,
      msg: '发送成功'
    }
  }

  async login (ctx) {
    const {
      body: {
        username,
        password,
        code,
        sid
      }
    } = ctx.request
    const result = await checkCode(sid, code)
    // 1. 接收用户数据
    // 2. 验证图片验证码是否过期
    // 3. 验证用户名密码正确
    // 4. 返回token
    // {
    //   "username": "junjun",
    //   "password": "123456",
    //   "code": "abcd",
    //   "sid": "35280fe3-a5f3-417a-a1d9-66abcb6afa4b"
    // }
    if (result) {
      // 查库, 判断用户名密码是否正确
      const user = await UserModel.findOne({
        username
      })

      let checkUserPassword = true
      // 比对加密之后密码是否正确
      if (await bcrypt.compare(password, user.password)) {
        checkUserPassword = true
      }
      if (checkUserPassword) {
        // 这样也可以设置过期时间
        // const token = jsonwebtoken.sign(
        //   { _id: 'brian' },
        //   config.JWT_SECRET,
        //   {
        //     expiresIn: '1d'
        //   }
        // )
        // 用户名密码正确, 生成token
        const token = jsonwebtoken.sign(
          {
            _id: user._id
            // exp: Math.floor(Date.now() / 1000) + 60 * 60 // 方式1设置过期时间 1小时过期
          },
          config.jwtSecret,
          {
            // 一天过期
            expiresIn: '1d'
          }
        )
        // 把用户信息查出来, 返回前台
        const userInfo = user.toJSON()
        // 删除掉一些铭感的数据
        // let arr = ['password', 'username', 'roles']
        const arr = ['password', 'roles']

        arr.forEach(item => {
          delete userInfo[item]
        })

        // 加入一个今日是否签到的属性
        const signRecord = await SignRecordModel.findByUid(user._id)
        if (signRecord !== null) {
          // debugger
          // 说明以前签到过了, 再看看签到
          if (moment(signRecord.createdTime).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            userInfo.isSign = true
          } else {
            userInfo.isSign = false
          }
          userInfo.lastSign = signRecord.created
        } else {
          userInfo.isSign = false
        }
        ctx.body = {
          code: 0,
          data: {
            ...userInfo,
            token
          },
          msg: '登录成功'
        }
      }
      else {
        ctx.body = {
          code: 1,
          msg: '用户名或密码错误'
        }
      }
    }
    else {
      ctx.body = {
        code: 1,
        msg: '验证码错误或已失效, 请刷新验证码'
      }
    }
  }

  async reg (ctx) {
    // 1. 判断验证码是否正确
    // 2. 校验用户名是否重复, 如果重复, 提示 `您可以使用忘记密码找回`
    // 3. 判断昵称是否存在, 不存在返回昵称已存在
    // let body = {
    //   username: '11776174@qq.com',
    //   name: 'lijunjun',
    //   password: '123456',
    //   repassword: '123456',
    //   code: '1234'
    // }
    const { body } = ctx.request
    const result = await checkCode(body.sid, body.code)
    // let check = true

    if (result) {
      // 判断用户名是否重复
      const user = await UserModel.findOne({ username: body.username })
      if (user !== null && typeof user.username !== 'undefined') {
        // check = false
        ctx.body = {
          code: 1,
          msg: '该邮箱已存在,您可以直接登录或重新设置密码'
        }
        return
      }
      const name = await UserModel.findOne({ name: body.name })
      if (name !== null && typeof name.name !== 'undefined') {
        // check = false
        ctx.body = {
          code: 1,
          msg: '该昵称已存在,试试别的昵称吧'
        }
        return
      }
      // 写入数据库
      const pwd = await bcrypt.hash(body.password, 5)
      const newUser = new UserModel({
        username: body.username,
        password: pwd,
        name: body.name,
        created: moment()
          .format('YYYY-MM-DD HH:mm:ss')
      })
      const result = await newUser.save()

      ctx.body = {
        code: 0,
        data: result,
        msg: '注册成功'
      }
    }
    else {
      ctx.body = {
        code: 1,
        msg: '验证码错误或已失效, 请刷新验证码'
      }
    }
  }
}

export default new LoginController()
