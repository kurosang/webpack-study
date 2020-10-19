const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')
const webpack = require('webpack')

const config = {
  mode: 'development', // 默认pro
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    open: true, // 启动之后自动打开浏览器
    port: 8080,
    hot: true,
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
  optimization: {
    usedExports: true,
  },
}

module.exports = merge(commonConfig, config)
