const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config.js')
// 在node中使用weboack
// complier就是webpack函数传入config之后返回的一个编译器，编译器执行的时候就会重新打包一次代码
const complier = webpack(config)

const app = express()
app.use(webpackDevMiddleware(complier, {}))

app.listen(3000, () => {
  console.log('app start')
})
