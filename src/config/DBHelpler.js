import mongoose from 'mongoose'
import config from './index'

mongoose.set('useCreateIndex', true)

mongoose.connect('mongodb://test:123456@121.37.183.14:27017/testdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// 连接成功
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected open to ${config.dbUrl}`)
})

// 连接异常
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connected err:${err}`)
})

// 断开连接
mongoose.connection.on('disconnect', () => {
  console.log('Mongoose connection disconnect')
})

export default mongoose
