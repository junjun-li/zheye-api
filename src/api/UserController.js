import SignRecordModel from '@/model/SignRecordModel'
import UserModel from '@/model/UserModel'
import { getJWTPayload } from '@/common/utils'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import send from '@/config/MailConfig'
import {
  getValue,
  setValue
} from '@/config/RedisConfig'
import jwt from 'jsonwebtoken'
import config from '@/config'
import bcrypt from 'bcrypt'

class UserController {
  // 用户签到
  async userSign (ctx) {
    // 1.根据对应的token取出用户id
    // 2. 查询用户上一次的签到记录
    const token = ctx.header.authorization
    const obj = await getJWTPayload(token)
    let newRecord = null
    let result = null
    const record = await SignRecordModel.findByUid(obj._id)
    const userInfo = await UserModel.findOne({ _id: obj._id })
    if (record !== null) {
      // 说明有签到数据
      // 判断上一次签到的日期和今天的日期是否一样
      // 如果相同, 返回今天已经签到,
      // 否则 保存签到数据
      if (moment(record.createdTime).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD')) {
        ctx.body = {
          code: 0,
          data: {
            integral: userInfo.integral, // 用户积分
            count: userInfo.count, // 用户签到的次数
            lastSign: record.createdTime
          },
          msg: '用户今日已签到'
        }
        return
      }
      else {
        // 修改用户表的积分, 连续签到次数 保存积分表的数据
        // 还需要判断是否连续签到, 如果断签, 给的积分是不一样的
        let count = userInfo.count
        let integral = 0
        if (
          moment(record.createdTime).format('YYYY-MM-DD') ===
          moment().subtract(1, 'days').format('YYYY-MM-DD')
        ) {
          // 连续签到了
          count += 1
          // 判断连续签到的天数, 给予相对应的积分
          if (count < 5) {
            integral = 5
          }
          else if (count >= 5 && count < 15) {
            integral = 10
          }
          else if (count >= 15 && count < 30) {
            integral = 15
          }
          else if (count >= 30 && count < 100) {
            integral = 20
          }
          else if (count >= 100 && count < 365) {
            integral = 30
          }
          else if (count >= 365) {
            integral = 50
          }
          await UserModel.updateOne(
            { _id: obj._id },
            {
              $inc: {
                count: 1,
                integral: integral
              }
            }
          )
          // 返回新的用户积分和累计签到数
          result = {
            integral: userInfo.integral + integral, // 用户原本的积分 + 5积分
            count: userInfo.count + 1 // 累计签到记数
          }
        }
        else {
          // 断签了 更新用户表和积分表
          // 连续签到的天数置空
          integral = 5
          await UserModel.updateOne(
            { _id: obj._id },
            {
              // 连续签到重新置位1天
              $set: { count: 1 },
              $inc: { integral: integral } // $inc 原有的积分递增
            }
          )
          result = {
            integral: userInfo.integral + integral,
            count: 1
          }
        }
        // 更新积分表
        newRecord = new SignRecordModel({
          uid: obj._id,
          // integral: userInfo.integral + integral
          integral: integral
        })
        await newRecord.save()
      }
    }
    else {
      // 无签到数据, 说明用户是第一次签到, 要更新用户表的签到记录和签到时间
      // 这里需要保存 用户表里面的签到数据, 也要修改积分表里面的签到记数和积分数据
      await UserModel.updateOne(
        {
          _id: obj._id
        },
        {
          $set: { count: 1 }, // $set 设置值, count的值设置成为1
          $inc: { integral: 5 } // $inc 把积分增加5分
        }
      )
      // 保存用户的签到记录, 用户下一次签到的时候, 才能判断是否连续的签到了
      newRecord = new SignRecordModel({
        uid: obj._id,
        integral: 5
      })
      await newRecord.save()

      result = {
        integral: 5,
        count: 1,
        lastSign: null
      }
    }
    ctx.body = {
      code: 0,
      data: {
        ...result,
        lastSign: newRecord.createdTime
      },
      msg: '操作成功'
    }
  }

  // 更新用户基本信息
  async updateUserInfo (ctx) {
    const { body } = ctx.request
    const token = ctx.header.authorization
    const obj = await getJWTPayload(token)
    // 真坑, null 和undefined 数据, 也会存进去
    const updateObj = {
      name: body.name,
      location: body.location,
      gender: body.gender,
      mobile: body.mobile,
      pic: body.pic,
      signature: body.signature
    }
    Object.keys(updateObj).forEach((item) => {
      if (updateObj[item] === null || typeof updateObj[item] === 'undefined') {
        delete updateObj[item]
      }
    })
    console.log(updateObj)
    const result = await UserModel.updateOne({ _id: obj._id }, updateObj)
    if (result.n === 1 && result.ok === 1) {
      ctx.body = {
        code: 0,
        msg: '修改成功'
      }
    }
    else {
      ctx.body = {
        code: 1,
        msg: '修改失败'
      }
    }
  }

  // 发送更改邮箱连接
  async sendUpdateEmail (ctx) {
    // 获取get请求的参数
    const body = ctx.request.query
    const token = ctx.header.authorization
    const objToken = await getJWTPayload(token)
    // 1. 查库,判断该邮箱是否存在
    const result = await UserModel.findOne({ username: body.updateUserName })
    if (result === null) {
      const userInfo = await UserModel.findOne({ _id: objToken._id })
      // // 发送邮件 修改邮箱
      const key = uuid()
      // 在redis里面存储key 用户id
      setValue(key, jwt.sign({ _id: objToken._id }, config.jwtSecret, {
        expiresIn: '30m'
      }))
      // 发送邮件
      const res = await send({
        type: 'email',
        data: {
          key: key,
          username: body.updateUserName
        },
        expire: moment()
          .add(30, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        email: userInfo.username,
        user: userInfo.name
      })
      ctx.body = {
        code: 0,
        msg: '邮件已发送',
        data: res
      }
    }
    else {
      ctx.body = {
        code: 1,
        msg: '该邮箱已存在'
      }
    }
  }

  // 确认修改邮箱
  async updateUsername (ctx) {
    const body = ctx.query
    if (body.key) {
      // 去除redis中的token
      const token = await getValue(body.key)
      const obj = getJWTPayload('Bearer ' + token)
      await UserModel.updateOne({ _id: obj._id }, {
        username: body.username
      })
      ctx.body = {
        code: 0,
        msg: '修改成功'
      }
    }
    else {
      ctx.body = {
        code: 1,
        msg: '参数错误'
      }
    }
  }

  // 修改密码
  async resetPassword (ctx) {
    const { body } = ctx.request
    // 1. 查库, 看看以前的密码和传入的是否一致
    // 2. 如果一致, 返回修改成功
    // 2.1 如果不一致, 返回密码错误, 请重新输入
    const token = ctx.header.authorization
    // 根据token 获取用户
    const obj = await getJWTPayload(token)
    // 获取用户呃旧密码
    const user = await UserModel.findOne({ _id: obj._id })
    if (await bcrypt.compare(body.oldPass, user.password)) {
      const newpasswd = await bcrypt.hash(body.newPass, 5)
      const result = await UserModel.updateOne(
        { _id: obj._id },
        { $set: { password: newpasswd } }
      )
      ctx.body = {
        code: 0,
        msg: '更新密码成功'
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '密码输入错误, 请重试'
      }
    }
  }
}

export default new UserController()
