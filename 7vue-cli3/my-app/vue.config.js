const path = require('path')

module.exports = {
  configureWebpack: {
    devServer: {
      contentBase: [path.resolve(__dirname, 'static')],
    },
  },
}
