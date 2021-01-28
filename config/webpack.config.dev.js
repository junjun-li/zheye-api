const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')
const webpack = require('webpack')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  // https://webpack.docschina.org/configuration/stats/
  stats: {
    // 告知 stats 是否添加关于子模块的信息。
    children: false
  }
})

module.exports = webpackConfig
