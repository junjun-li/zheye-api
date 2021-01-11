import mongoose from 'mongoose'
import config from './index'

mongoose.connect(config.db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// 连接成功
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected open to ${ config.db_url }`)
})

// 连接异常
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connected err:${ err }`)
})

// 断开连接
mongoose.connection.on('disconnect', () => {
  console.log(`Mongoose connection disconnect`)
})

export default mongoose
