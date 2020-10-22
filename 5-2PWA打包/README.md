# webpack-study

webpack 学习记录，希望手打一次记忆深刻点。

### 3-1 什么是 loader？

loader 其实就是打包方案，当 webpack 遇到不会打包的文件，就会出动 loader。webpack 默认是处理打包 js 模块，它不知道 jpg 等其他类型怎么办，所以我们就得在配置文件配置，告诉它怎么办。写在配置文件中 module 对象下的 rules[]中。

### 3-2 loader 打包静态资源-图片篇？

file-loader 和 url-loader 都可以打包图片，但是前者是打包重新生成一个图片文件，后者是将图片转为 base64.

url-loader 其实就是 file-loader 加了 limit 功能。

自动转为 base64 打包到 js 里面的好处就是减少请求，当 js 加载完之后不需要额外的发送图片资源请求，但是如果图片过大，打包到 js 里面，就会导致 js 加载缓慢，因此需要在 url-loader 里面 options 加上 limit 字段，超过 limit 大小就会打包成文件。

### 3-3 loader 打包静态资源-样式篇-上

css-loader 会帮我们分析出几个 css 文件的关系，最终合并成一段 css。
style-loader 作用是当 css-loader 生成了 css 后，将内容挂在 document 上的 style 标签里。

当我们使用 scss，less，stylus 等 css 语言时，还需要添加对应的 loader，将其转为 css 语法.

scss 需要安装 sass-loader 和 node-sass。

loader 是从下到上，从右到左的执行顺序。

postcss-loader：打包时自动添加厂商前缀，-webkit-，mozila 等

**下**

如果 js 引入 index.scss，index.scss 又 import 了 avatar.scss，有可能 avatar.scss 就没有走 sass-loader 和 postcss-loader,而是从 css-loader 开始走。所以要在 css-loader 里配置 importLoaders 属性。

我们在 js 中 import "./index.scss"; 实际上引入的 css 是对全局应用的，这样十分不好，因为很容易影响到其他模板，因此引入 css module 的概念。在 css-loader 中 option 开启 module：true，具体应用看代码例子。

### 3-4 loader 打包静态资源-字体文件等

iconfont 里面的字体文件 eot，svg 等需要用 file-loader 来打包。

其实还有很多其他文件类型的静态资源，更多去看：[官方文档-guides-asset management](https://www.webpackjs.com/guides/asset-management/)

### 3-5 plugin

plugin: 可以在 webpack 运行到某个时刻的时候，帮你做一些事情。（有点类似生命周期函数。）

HtmlWebpackPlugin 插件：会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 自动引入到这个 html 文件中。[更多](https://www.webpackjs.com/plugins/html-webpack-plugin/)

CleanWebpackPlugin 插件：默认情况下，此插件将 output.path 的内容在打包前删除。

### 3-6 entry 与 output

如果 output 写死 output.filename 为'main.js',当 entry 有两个入口文件时，就会报错，所以要使用 output 占位符。

webpack 打包完之后会将 js 注入到 html 模板，如果想要引入的 js 带上 cdn 地址，就在 output.publicPath 配置 cdn 的地址。

[阅读文档相关-配置-entry and contex/output](https://www.webpackjs.com/configuration/entry-context/)

[阅读文档相关-指南 guides-管理输出](https://www.webpackjs.com/guides/output-management/)

### 3-7 sourceMap

假如我们运行打包之后的文件，发现有 js 报错，现在知道 dist 目录下 main.js 文件 96 行出错

sourceMap 它是一个**映射关系**，他知道 dist 目录下 main.js 文件 96 行实际上对应的是 src 目录下 index.js 文件中的第一行。

当前其实是 src 目录下 index.js 文件中的第一行出错了

打开 sourceMap 方法：在 webpack.config 里的 devtool 字段设置为'source-map'。

inline-source-map：使用‘source-map’打包时会在 dist 出现 map.js 文件（映射关系），当使用 inline-source-map 时，会直接打包到 js 文件里面，base64 的形式。

cheap-inline-source-map：加了 cheap 之后就只会提示第几行出错，如果不加，会精确到第几行第几列。这样可以提高 build 和 rebuild 的速度。

cheap-module-source-map：加了 module 之后，不仅只管自己的业务代码错误，像一些第三方枯，loader 的错误也会管。

eval：build 执行速度最快，性能最快，也可以提示源代码的第几行错误，但它时通过在打包的 js 里面执行 eval 语句，生成对应的映射关系，缺点：如果过于复杂的逻辑可能不太准确

**总结**：

- dev 模式，cheap-module-eval-source-map
- prod 模式，cheap-module-source-map

### 3-8 webpackDevServer

如果我们想要代码改变之后，自动打包，不需要每次都手动打包，有三种方法：

- webpack --watch

  这里有一个坑：CleanWebpackPlugin 的 cleanStaleWebpackAssets 属性要设置为 false，不然 index.html 会丢失。

  cleanStaleWebpackAssets： 删除陈旧的 webpack 资源。

  在 watch 模式下，CleanWebpackPlugin 里 cleanStaleWebpackAssets 要设置为 false ，防止监听到改变时把没有改变的文件给清除了。

- webpackDevServer（需要另外安装 webpack-dev-server）

  使用方法：webpackConfig.devServer 要设置指定根路径，安装之后，运行命令 webpack-dev-server。

  webpackConfig.devServer 常用属性：

  - contentBase：指定 server 根路径
  - port：端口号
  - open：自动打开浏览器
  - proxy：跨域代理，像 vue，react 的脚手架之所以支持，是因为其底层是利用 webpack-dev-server，而 webpack-dev-server 本身就支持。

  webpackDevServer 对比--watch，不仅会监听文件重新打包，而且会重新刷新浏览器。

- 自己写一个 server.js，使用命令 node server.js 来监听文件变化并重新打包。

  主要思路：在 server.js 建立一个 express 或者 koa2 服务，通过 webpack 方法生成一个编译器（本质就是在 node 中使用 webpack，我们上面都是在命令行使用 webpack），然后服务通过中间件 webpackDevMiddleware 调用 webpack 编译器

### 3-9 热模块替换 HMR

背景：我们上面通过 webpack-dev-server，当监听到有文件变化时，会重新打包刷新浏览器。假如我们只改变了某个 css 文件，那是否可以就更新 css 资源文件，其他保持不变？这就是 HMR 的作用。

使用方法：

- 1.webpack.config.devServer.hot 开启为 true
- 2.webpack.config.plugins 添加 new webpack.HotModuleReplacementPlugin()

HMR 使用场景：

- 1.引入的 css 发生改变时，css 资源替换，js 不重新加载。
- 2.假设 index.js 引入了 a.js 和 b.js，当 b.js 改变时，如果想不改变 a.js，需要在 index.js 里加判断

```
if (module.hot) {
    // 监听的js资源文件
  module.hot.accept('./number.js', () => {
    // 重新执行number.js的方法或者做其他处理
  })
}
```

！这里可能有一个疑惑：为什么 js 需要加一段这样的判断，css 不用？原因是 css-loader 内置帮我们写了，而我们平时用 vue 开发时，也不用写是因为 vue-loader 内置写了。

总结：只要使用 HMR，原则上都需要写 module.hot 的判断，只是现在很多框架都写好了，不需要我们亲自写。

[更多 HMR 学习](https://www.webpackjs.com/guides/hot-module-replacement/)

### 3-10 使用 babel 处理 es6 语法

1.安装 babel-loader @babel/core

2.设置 rules

```
rules: [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env'],
        },
    },
]
```

以上两步只是打通了 webpack 和 babel 的桥梁，要将 es6 转为 es5，还需要安装 @babel/preset-env 翻译语法，另外有一些 es6 的语法比如 primise 等，在低版本的浏览器是没有的，仅仅翻译还是不行，还需要安装@babel/polyfill 做一个补充。

当我们在 js 里加入了 import '@babel/polyfill'，它会自动的把所有补充的代码打包进去。如果我们只想要打包用到的代码，比如只想要 promise 的实现打包进去，我们需要在 babel-loader 配置 useBuiltIns: 'usage'。

```
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
        presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
            },
        ],
        ],
    },
},
```

我们还可以在 babel-loader 设置，浏览器的要求，当大于某个版本才进行 env 语法翻译

```
{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  chrome: '67',
                  // safari...
                  // firefox...
                },
                useBuiltIns: 'usage',
              },
            ],
          ],
        },
      },
```

当我们在开发 ui 库或者组件时，不建议在 js 中引入 import '@babel/polyfill'来打包，因为@babel/polyfill 会在全局加上一些变量，造成污染。我们可以这样做：

1.安装 @babel/plugin-transform-runtime 和 @babel/runtime

2.修改 babel-loader（如果使用了 corejs：2 的配置，还要安装@babel/runtime-corejs2）

```
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
        // presets: [
        //   [
        //     '@babel/preset-env',
        //     {
        //       targets: {
        //         chrome: '67',
        //       },
        //       useBuiltIns: 'usage',
        //     },
        //   ],
        // ],
        plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                corejs: 2,
                helpers: true,
                regenerator: true,
                useESModules: false,
              },
            ],
        ],
    },
},
```

**总结：如果是写业务代码，可以用 preset-env。如果是开发库的代码，使用@babel/plugin-transform-runtime，会以闭包等形式注入，不会污染全局。**

！另外，如果用了 preset-env，就不需要手动引入 import ployfill 了。

babel-loader 的 options 可能会配置很长，我们可以在根目录创建一个.babelrc 文件

```
// .babelrc
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

```
// webpack.config.js
...
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    }
...
```

---

### 4-1 Tree Shaking

翻译中文就是摇树，将没用到的资源摇掉（剔除掉，不打包到 js 里去）。

比如一个工具类 js 导出很多工具函数，我们只 import { a } from 'util.js'，那么 util.js 里面的其他工具函数就不会被打包进去。

**！！ Tree Shaking 只支持 ES Module 模式的引入（因为这是静态引入），require 不支持（动态）。**

dev mode 环境下使用的话，需要在 webpack.config 设置 optimization.usedExports 为 true,同时去 package.json 设置

```
"sideEffects": ["@babel/polly-fill","*.css"...],
```

因为像一些模块没有导出内容的，比如 import './style.css' ，tree shaking 会判断它导出什么，引用了什么，所以对于没有导出东西，tree shaking 会去掉，所以我们要在 package.json 里设置不需要 tree shaking 的模块。

dev 环境开了 tree shaking 也不会去掉多余的代码，因为会对 sourcemap 有影响，影响我们的调试开发。

prod 正式环境默认开启 tree shaking，不需要手动设置 optimization.usedExports。

### 4-2 dev 和 prod

差异：dev sourmap 很全，一般代码不压缩。

区分 dev 和 prod 环境，修改 package.json

```
 "scripts": {
    "dev": "webpack-dev-server --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
```

改造目录结构：

- 新增三个文件：

```
webpack.prod.js
webpack.dev.js
webpack.common.js //存放上面两个配置文件共同的部分
```

- 安装 webpack-merge

```
// webpack.prod.js
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const config = {
  mode: 'production', // 默认pro
  devtool: 'cheap-module-source-map',
}

module.exports = merge(commonConfig, config)

```

### 4-3 webpack 与代码分割（code splitting）

场景：

// index.js

```
import _ from 'lodash'

console.log(_.join(['a', 'b', 'c'], '**'))
// 此处省略10万行业务
console.log(_.join(['a', 'b', 'c'], '**'))
```

假设 lodash 大小为 1MB,index.js 业务代码大小为 1MB，打包之后就 2MB

出现问题：

- 打包文件很大，加载时间长
- 修改业务逻辑之后重新访问页面，又要加载 2MB 的内容

解决方案：

把 main.js 拆成 lodash.js(1MB),main.js(1MB)，当页面业务逻辑发生变化时，只要加载 main.js 即可（1MB）.

### 4-4 代码分割（code splitting）

开启方法：

```
//webpack.config
...
optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
...
```

总结：

- 代码分割其实和 webpack 无关，只是 webpack 做代码分割很容易
- 两种代码分割：
  - 同步代码：顶部 import（ES Module）进来的，去 webpack.config 配置。
  - 异步代码：通过 import 方法异步加载的资源或模块，无需配置，即会放到新文件中。

### 4-5 splitChunksPlugin 配置详解

webpack 内部实现代码分割其实就是用了 splitChunksPlugin 这个插件。

Magic Comment（魔法注释）：设置异步加载模块的名字

```
function getComp() {
  return import(/* webpackChunkName:"lodash" */ 'lodash').then(
    ({ default: _ }) => {
      var elem = document.createElement('div')
      elem.innerHTML = _.join(['123', '456'], '-')
      return elem
    }
  )
}
```

以上代码打包后生成 /dist/vendors~lodash.js

如果想要去掉文件名前面的 vendors，可以在 webpack.config 配置

```
 optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: false,// 去掉文件名前面的 vendors
        default: false,// 去掉文件名前面的 vendors
      },
    },
  },
```

实际上，splitChunks 有一份默认配置,当我们 splitChunks: {}为空时，就是读取默认

```
// 默认
splitChunks: {
    chunks: "async",
    minSize: 30000, // 30kb
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename: 'vendors.js' // 如果想组的所有东西都打包在一个js，就设置这个
      },
      default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
      }
    }
}
```

chunks 和 cacheGroups 一般配合使用

chunks：async 只对异步代码生效，设置为 all，就可以打包同步代码，但还要在 cacheGroups.vendors 设置，

cacheGroups（缓存组）: 就是一个分组，vendors 就是检测引入的模块是不是 node_modules 的，如果是，就放进这个组，文件名前加组名。

cacheGroups.priority 数值越大，优先级越高。当一个文件符合两个组时，按优先级来打包到对应的组

cacheGroups.reuseExistingChunk 如果符合代码分割的代码之前已经被打包到某个文件里，设置为 true 就不会重复打包，直接使用之前的

minChunks：至少被引入了多少次，才代码分割。（就是打包之后的 chunk 里面有引入到的，符合这个次数才代码分割）

maxAsyncRequests：同时加载的模块数，最多的数量，超过就不会代码分割。

maxInitialRequests：入口文件做代码分割，最多的数量，超过就不会代码分割。

automaticNameDelimiter：组和文件之间的连接符

[更多阅读](https://www.webpackjs.com/plugins/split-chunks-plugin/)

### 4-6 lazy loading 懒加载和 chunk 是什么？

懒加载不是 webpack 有的概念，而是 ES 里面的概念。webpack 只是可以识别 import 这种语法，对它进行一个代码分割。

代码分割出的每个 js 就是一个 chunk

### 4-7 打包分析，preloading，prefetching

**打包分析**

[webpack analyse 仓库](https://github.com/webpack/analyse)

使用方法：

- 在 webpack 的打包语句后面加上 `--json > stats.json`

- 生成文件之后，打开 webpack analyse 仓库里面网址（科学上网），然后上传 stats.json 文件

[更多分析工具](https://webpack.js.org/guides/code-splitting/#bundle-analysis)

**代码使用率 code coverage**

代码分割，抽出共有的 chunk 实际是做一个缓存，第二次加载的时候不需要重新加载。但如果想要提高第一次加载的速度，就不应该看这个。

要做高性能的前端应该不仅注重缓存，还有代码的使用率。通过 chrome F12，command+Shift+P 可以看到，每个文件代码的使用率。

如果我们可以做到把没有用到的代码异步加载，那么网页首屏加载的速度就会提升，所以 webpack 默认代码分割是异步 async，而不是 all 全部，因为全部只能做到缓存的作用

**Prefetching/Preloading**

使用方法（魔法注释）：

```
//...
import(/* webpackPrefetch: true */ 'LoginModal');

//...
import(/* webpackPreload: true */ 'ChartingLibrary');
```

区别：

与 Prefetching 相比，Preloading 指令有很多区别：

- 预加载的块开始并行于父块加载。父块完成加载后，预取的块开始。
- 预加载的块具有中等优先级，可以立即下载。浏览器空闲时，将下载预提取的块。
- 父块应立即请求预加载的块。预取的块可以在将来的任何时候使用。
- 浏览器支持不同。

### 4-8 css 代码分割

`webpack.config.output.filename` 是 entry 入口文件打包出来之后走这个字段
`webpack.config.output.chunkFilename` 是 非入口文件，入口文件引入的文件（间接引用）

一般 css 会打包到 js 文件里面，即 css in js。

MiniCssExtractPlugin：该插件将 CSS 提取到单独的文件中。它为每个包含 CSS 的 JS 文件创建一个 CSS 文件。（一般用于生产，因为 dev 的热更新支持不太好）

使用方法：

- 修改 prod 的 webpack 配置
- 修改 package.json 的 sideEffects，treeskaing 关掉 css 文件

如果用于生产环境，还需要安装插件 css-minimizer-webpack-plugin 进行 css 合并和压缩。

[更多](https://webpack.js.org/plugins/mini-css-extract-plugin/)

### 4-9 webpack 与浏览器缓存（caching）
