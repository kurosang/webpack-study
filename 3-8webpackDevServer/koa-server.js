const Koa = require('koa')
const app = new Koa()
const webpack = require('webpack')
const koaWebpackDevMiddleware = require('koa-webpack-dev-middleware')
const config = require('./webpack.config.js')
// 在node中使用weboack
// complier就是webpack函数传入config之后返回的一个编译器，编译器执行的时候就会重新打包一次代码
const complier = webpack(config)
app.use(koaWebpackDevMiddleware(complier, {}))

app.listen(3001, () => {
  console.log('koa-server start at 3001')
})
