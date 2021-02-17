import mongoose from '@/config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const CommentsHandsSchema = new Schema({
  cid: { type: String },
  uid: { type: String },
  createdTime: { type: String }
})

CommentsHandsSchema.pre('save', function (next) {
  this.createdTime = moment()
    .format('YYYY-MM-DD HH:mm:ss')
  next()
})

CommentsHandsSchema.statics = {
  findByCid: function (id) {
    return this.find({ cid: id })
  }
}

const CommentsHandsModel = mongoose.model('comment_hands', CommentsHandsSchema)

export default CommentsHandsModel
