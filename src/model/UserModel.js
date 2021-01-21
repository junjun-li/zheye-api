import mongoose from '@/config/DBHelpler'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
  name: { type: String },
  created: { type: Date } // 注册时间
})

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
