const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const config = {
  mode: 'production', // 默认pro
  devtool: 'cheap-module-source-map',
}

module.exports = merge(commonConfig, config)
