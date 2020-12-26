const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  stats: {
    children: false,
    warnings: false,
  },
  optimization: {
    // minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        // https://github.com/terser-js/terser#minify-options
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            // 是否注释console.log
            drop_console: false,
            dead_code: true,
            drop_debugger: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
          mangle: true,
        },
        // https://webpack.docschina.org/plugins/terser-webpack-plugin/#parallel
        parallel: true,
        // sourceMap: false // 老师的这个属性会报错
      }),
    ],
    // https://webpack.docschina.org/plugins/split-chunks-plugin/#split-chunks-example-1
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       name: 'commons',
    //       chunks: 'initial',
    //       minChunks: 3,
    //       // 强制执行
    //       enforce: true
    //     }
    //   }
    // }
  },
})

module.exports = webpackConfig
