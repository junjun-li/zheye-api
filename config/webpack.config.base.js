const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const utils = require('./utils')

const webpackConfig = {
  target: 'node',
  entry: {
    server: path.join(utils.APP_PATH, 'index.js'),
  },
  // resolve: {
  //   ...utils.getWebpackResolveConfig()
  // },
  output: {
    filename: '[name].bundle.js',
    path: utils.DIST_PATH
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        },
        // exclude: [
        //   path.resolve(__dirname, 'node_modules')
        // ] // 把node_modules排除在外
      },
    ],
  },
  externals: [webpackNodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    // webpack.DefinePlugin 配置指南
    // https://webpack.docschina.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: (process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'prod') ? '\'production\'' : 'development',
      },
    }),
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
  },
}

module.exports = webpackConfig
