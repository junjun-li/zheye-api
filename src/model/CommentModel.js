import mongoose from '@/config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const CommentSchema = new Schema({
  tid: {
    type: String,
    ref: 'post'
  },
  uid: {
    type: String,
    ref: 'users'
  },
  createdTime: { type: String },
  // 点赞数量
  hands: { type: Number, default: 0 },
  // 是否显示，0-否，1-是
  status: { type: String, default: '1' },
  // 是否已读，0-否，1-是
  isRead: { type: String, default: '0' },
  // 是否采纳，0-否，1-是
  isBest: { type: String, default: '0' },
  content: { type: String }
})

CommentSchema.pre('save', function (next) {
  this.createdTime = moment()
    .format('YYYY-MM-DD HH:mm:ss')
  next()
})

CommentSchema.statics = {
  findByTid: function (id) {
    return this.find({ tid: id })
  },
  findByCid: function (id) {
    return this.findOne({ _id: id })
  },
  findCommentsById ({ id, page, pageSize }) {
    return this.find({ tid: id })
      .populate({
        path: 'uid',
        select: 'name isVip pic _id status', // 筛选出来的字段
        // 未被禁用的账户 match: 过滤
        match: { status: { $eq: '0' } }
      })
      .populate({
        path: 'tid',
        // status 是否开启回复
        select: '_id title status'
      })
      .skip((page - 1) * pageSize) // 跳过多少条数据
      .limit(pageSize) // 取多少条数据
      // .skip(page * pageSize).limit(pageSize)
  },
  queryCount (id) {
    return this.find({ tid: id })
      .countDocuments()
  }
}

const CommentModel = mongoose.model('comments', CommentSchema)

export default CommentModel
