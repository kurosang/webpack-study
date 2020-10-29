class CopyrightWebpackPlugin {
  constructor({ name }) {
    console.log('插件被使用了。', name)
  }

  // 调用插件的事件调用这个方法，compiler是webpack的实例
  apply(compiler) {
    compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
      console.log('compile')
    })

    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        debugger
        console.log(compilation.assets)
        compilation.assets['copyright.txt'] = {
          source: function () {
            return 'copyright'
          },
          size: function () {
            return 9
          },
        }
        cb()
      }
    )
  }
}

module.exports = CopyrightWebpackPlugin
