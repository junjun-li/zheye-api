const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
debugger
const webpackConfig = {
  target: 'node',
  mode: 'development',
  entry: {
    server: path.join(__dirname, 'app.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './dist')
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        // exclude: [
        //   path.resolve(__dirname, 'node_modules')
        // ] // 把node_modules排除在外
      }
    ]
  },
  externals: [webpackNodeExternals()],
  plugins: [
    new CleanWebpackPlugin()
  ],
  // 从 webpack 5 开始，你只能在 node 选项下配置 global、__filename 或 __dirname。如果需要在 webpack 5 下的 Node.js 中填充 fs，请查阅 resolve.fallback 获取相关帮助。
  node: {
    // console: true,
    global: true,
    // process: true,
    // Buffer: true,
    __filename: true,
    __dirname: true,
    // setImmediate: true,
    // path: true
  }
}

console.log(webpackConfig)

module.exports = webpackConfig
// npx node --inspect-brk ./node_modules/.bin/webpack --inline --progress
// npx node --inspect-brk ./node_modules/.bin/webpack --inline --progress
