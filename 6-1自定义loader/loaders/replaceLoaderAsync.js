const loaderUtils = require('loader-utils')

module.exports = function (source) {
  // console.log(this.query)
  // const options = loaderUtils.getOptions(this)
  // console.log(options.name)
  // 直接return
  // return source.replace('kuro', 'kurosang')

  // callback
  // const result = source.replace('kuro', 'kurosang')
  // this.callback(null, result)

  //异步写法
  const callback = this.async()

  setTimeout(() => {
    const result = source.replace('kuro', 'kurosang')
    callback(null, result)
  }, 1000)
}
