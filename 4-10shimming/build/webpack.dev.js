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
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
}

module.exports = merge(commonConfig, config)
