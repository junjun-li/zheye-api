import combineRouters from 'koa-combine-routers'

// import publicRouter from '@/routes/publicRouter'
// import loginRouter from '@/routes/loginRouter'
// import contentRouter from '@/routes/contentRouter'
// import userRouter from '@/routes/userRouter'

const moduleFiles = require.context('./modules', true, /\.js$/)
// require.context(
//   要搜索的目录,
//   布尔值 标记表示是否还搜索其子目录,
//   以及一个匹配文件的正则表达式。
// )

// moduleFiles 是什么????
// moduleFiles 会导出一个函数, 此函数可以接受一个参数
// 示例: moduleFiles(path)
// 并且此函数有三个属性 resolve, keys, id。
// 示例: moduleFiles.keys()

const modules = moduleFiles.keys().reduce((items, path) => {
  const value = moduleFiles(path)
  items.push(value.default)
  return items
}, [])

export default combineRouters(
  // loginRouter,
  // publicRouter,
  // contentRouter,
  // userRouter
  modules
)
