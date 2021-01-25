import mongoose from '@/config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const SignRecordSchema = new Schema({
  uid: {
    type: String,
    ref: 'users'
  },
  createdTime: { type: String },
  integral: { type: Number }
})

SignRecordSchema.pre('save', function (next) {
  this.createdTime = moment()
    .format('YYYY-MM-DD HH:mm:ss')
  next()
})

SignRecordSchema.statics = {
  findByUid: function (uid) {
    return this
      .findOne({ uid }) // 根据uid来查找
      .sort({ createdTime: -1 }) // 根据创建时间倒叙排列
  }
}

// 神坑 解决自动添加s的问题
// 详细见官网 https://mongoosejs.com/docs/api.html#connection_Connection-model
// When no collection argument is passed, Mongoose produces a collection name by passing the model name to the utils.toCollectionName method. This method pluralizes the name. If you don't like this behavior, either pass a collection name or set your schemas collection name option.
const SignRecordModel = mongoose.model(
  'sign_record',
  SignRecordSchema
)

export default SignRecordModel
