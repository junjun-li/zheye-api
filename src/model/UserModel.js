import mongoose from '@/config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    // index: 唯一的键值, 可以从数据库层面避免数据的重复插入
    // 唯一的索引, 加入这个索引, 可以保证username的唯一性
    index: { unique: true },
    // 如果没有username属性, 这一条数据不会被检索
    sparse: true
  },
  password: { type: String },
  name: { type: String },
  createdTime: { type: String },
  updatedTime: { type: String },
  // 积分
  integral: {
    type: Number,
    default: 100
  },
  gender: {
    type: String,
    default: ''
  },
  roles: {
    type: Array,
    default: ['user']
  },
  pic: {
    type: String,
    default: '/img/header.jpg'
  },
  mobile: {
    type: String,
    match: /^1[3-9](\d{9})$/,
    default: ''
  },
  status: {
    type: String,
    default: '0'
  },
  // 个性签名
  signature: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  isVip: {
    type: String,
    default: '0'
  },
  count: {
    type: Number,
    default: 0
  }
})

UserSchema.pre('save', function (next) {
  this.createdTime = moment()
    .format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.pre('update', function (next) {
  this.updatedTime = moment()
    .format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 如果往数据库存储同一个邮箱的话, 数据库就会抛出异常
UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Error: Mongoose has a duplicate key.'))
  } else {
    next(error)
  }
})

UserSchema.statics = {
  // 根据id查找用户, 排除password,username,mobile字段不检索出来
  findByID: function (id) {
    return this.findOne({ _id: id }, {
      password: 0,
      username: 0,
      mobile: 0
    })
  }
}

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
