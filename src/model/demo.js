import User from './test'
// src目录下 npx babel-node src/model/demo.js
// 增
const user = {
  name: 'junjun',
  age: 18,
  email: '11776174@qq.com',
}

const run = async () => {
  const data = new User(user)
  const result = await data.save()
  console.log(result)
}

// {
//   _id: 5fec99b811412389aa71f0b6,
//   name: 'junjun',
//   age: 18,
//   email: '11776174@qq.com',
//   __v: 0
// }

// 查
const run1 = async () => {
  const result = await User.find()
  console.log(result)
}

// 改
const run2 = async () => {
  const result = await User.updateOne({ name: 'lijunjun' }, {
    email: '11776174@qq.com',
  })
  console.log(result)
}
// Mongoose connected open to mongodb://test:123456@121.37.183.14:27017/testdb
// { n: 1, nModified: 1, ok: 1 }

// 删
const run3 = async () => {
  const result = await User.deleteOne({ name: 'lijunjun' })
  console.log(result)
}
// Mongoose connected open to mongodb://test:123456@121.37.183.14:27017/testdb
// { n: 1, ok: 1, deletedCount: 1 }

run3()
