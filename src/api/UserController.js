import SignRecordModel from '@/model/SignRecordModel'
import UserModel from '@/model/UserModel'
import { getJWTPayload } from '@/common/utils'
import moment from 'moment'

class UserController {
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
}

export default new UserController()
