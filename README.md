# webpack-study

webpack 学习记录，希望手打一次记忆深刻点。

### 2

webpack 三种方式

- webpack index.js（全局）
- npx webpack index.js
- npm run bundle (在 package.json 里 script 输入准备执行的命令)

输出部分描述

- Hash 每次打包的唯一值
- Chunks 每个 js 文件对应的 id
- Chunk Name 每个 js 文件对应的名字
- mode production:被压缩代码，development：不被压缩

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

在生产环境中，假设我们打包之后的 js 叫 main.js，当用户第一次访问之后就会缓存。当我们改了业务逻辑，重新打包发布之后，用户第二次刷新，浏览器获取的还是之前的 js，因为名字相同，浏览器会有本地缓存。因此 output 文件名要加上哈希值。

`[contenthash]` 这个占位符，只有打包的内容有改动，哈希才会改变。

老版本 webpack 可能每次打包都会变哈希值，即使没有改动内容。需要做额外配置

```
optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
}
```

manifest：业务逻辑和库之间的关联，关联的代码，内置的代码。它存在于 main.js，也存在于 vendor.js 里面

runtimeChunk 就是抽离 manifest 部分的代码

### 4-10 shimming 垫片（全局变量）

- 例子 1

webpack 打包，默认每个模块是独立的，即每个 js 文件是独立的，并且文件内的引入的资源或者变量只能服务于该模块（文件），其他模块使用就会报错，如果其他模块也想用，只能在其他模块也引入。

webpack 自带的插件`webpack.ProvidePlugin`，可以定义

```
const webpack = require('webpack')
...
plugins: [
    ...,
    new webpack.ProvidePlugin({
      $: 'jquery',
      _join: ['lodash', 'join']
    }),
  ],
```

上面代码是打包时发现如果有 js 文件里有\$符号，就会自动帮你引入 jquery.

一般可以理解为这是一个垫片，通过配置它，解决一些库的问题，比如里面用了\$，但没有引入 jq。

- 例子 2

每个 js 文件的 this 是指向该文件的 object，如果想要所有 js 文件的 this 指向 window 呢？？

方法：使用 imports-loader，匹配使用 js 文件，改变 this 指向，这种操作，也叫 shimming，垫片。

```
module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        },{
          loader: 'imports-loader？this=>window'
        }]
      }
    ]
}
```

[更多](https://webpack.js.org/guides/shimming/)

### 4-11 环境变量

见代码，--env

## 5 webpack 实战配置案例

### 5-1 library（函数库）打包

封装了函数之后，打包之后给别人使用，需要考虑：

- es module

```
import library from 'library'
```

- commonJS

```
const library = require('library')
```

- AMD

```
require(['library'],function(){

})
```

以上使用方式可以通过配置 webpack.config.output.libraryTarget 设置为`'umd'`获得。

此外，如果通过 script 标签引入，挂到全局变量上

```
<script src="library.js"></script>

window.library.math...
```

需要通过配置 webpack.config.output.library

库里面引用到其他库，想打包的时候忽略其他库，可配置 webpack.config.externals

将库发布到 npm 上：

- 注册 npm
- 项目根目录命令行 npm adduser
- 修改 package.json 的 name（npm 包的名字）和 main（入口）
- 项目根目录命令行 npm publish

成功之后就可以通过 npm install xxx 来使用

### 5-2 PWA 打包配置

正常我们启动服务器，然后访问地址，加载页面。如果服务器出了问题，就访问不了。

PWA 就是当我们访问过该地址，即使服务器挂掉了，第二次访问，在本地有缓存，可以看到之前的页面。

PWA 实际底层用到一个 service worker,可以理解为一个另类的缓存

实际使用看代码 5-2

### 5-3 ts 打包配置

1.安装 ts-loader 和 typescript

2.根目录新建 tsconfig.json

3.webpack.config 设置 ts-loader

如果其他库比如 lodash，也想要 ts 的提示或者检查报错，需要怎么做？

安装 @types/lodash

如何查找这个库有没有对应的@types？

[TypeSearch](https://www.typescriptlang.org/dt/search?search=)

### 5-4 proxy 请求转发

一般 axios 请求写的是相对路径`（/api/list）`，不是绝对路径`（http://dada.com/api/list）`

使用 webpack 的 devServer 里面的 proxy 可以做请求转发，代理域名，一般用来解决跨域。

### 5-5 eslint 结合 webpack

eslint 有三种方法：

- 1.使用 vscode 插件，编辑器会红线报错
- 2.yarn 安装 eslint，运行 npx eslint，报错会出现在命令行
- 3.安装 eslint 和 eslint-loader，在 webpack 的 devServer 配置 overlay 为 true，在匹配 js 的 loader 加上 eslint-loader，当报错的时候，就会在网页弹出遮罩层。vue 很多报错就是这个原理。（但一般不这样做，因为降低打包速度）

### 5-6 webpack 优化 1

- 1.跟上技术的迭代（node，npm，yarn）

  webpack 内部也是使用 node 这些的，如果 webpack/node 这些升到最新，打包速度就是最快。

- 2.在尽可能少的模块上应用 loader（loader 作用范围变少）

  - test：匹配对应后缀结尾的文件
  - exclude：排除某个目录
  - include: path.resolve(\_\_dirname,'../src/'),源代码目录下才使用 loader

- 3.Plugin 尽可能精简并确保可靠

  官方认证过，社区认可的，比较好的插件，

- 4.resolve 参数合理配置

```
// webpack config

module.exports = {
  entry..
  resolve: {
    extensions: ['.css','.png','.js','.jsx'],
    mainFiles:['index','child'],
    alias:{
      demo: path.resolve(__dirname, '../src/child')
    }
  }
}
```

配置了 extensions 之后，import 引入的文件就可以不写后缀，它会自己去匹配，不可以配太多，因为会有损耗，相当于每次都去 extensions 都会去循环看有没有匹配上

配置了 mainFiles 之后，import 就可以简写到文件夹，不用写具体文件的名字，因为配置了这个之后，会匹配该文件夹下，mainFiles 有的字段所开头的文件

配置了 alias 之后，可以直接`import child from 'demo'`,相当于是配置了一个别名，代替这个引入的路径。当文件在很多层的文件夹里，可以配置这个，简化引入的路径

### 5-7 webpack 优化 2

- 5. 使用 DllPlugin 提高打包速度（目标第三方模块只打包一次，引入第三方模块的时候，要去使用 dll 文件注入）

  1.新建文件 webpack.dll.js,入口设置要 dll 的第三方模块，将第三方库打包成一个 dll 文件下的文件，通过 library 将它变成全局变量暴露出去。

  2.在 webpack.dll.js 中配置 new webpack.DllPlugin 插件，对暴露的模块代码做一个分析，生成一个 manifest.json 的映射文件

  3.将 library 引入到 index.html，通过 add-asset-html-webpack-plugin 插件

  4.在 webpack.common 中，配置 webpack.DllReferencePlugin 插件，这是引用插件，配置 manifest，就会自动找对应的映射关系。即它会去 manifest.json 里看看是否有，有的话就去全局拿，不从 node_module 拿。

总结：为什么要使用 DllPlugin，因为正常，我们每次打包，碰到第三方模块，就会从 node_module 里面拿，然后打包到我们的 js 里面。这些库，基本不会变，所以我们第一次打包就把这些库打包成一个文件，下次直接拿这个文件，而不用去 node_module 拿来再打包。打包速度就会提高。

### 5-8 webpack 优化 3

- 6. 控制包文件大小

  1)如果没有 treeShaking，减少没有使用的库的引入，不然会出现冗余代码

  2)splitChunks 对代码进行拆分，也可以有效提高 webpack 打包速度

- 7. thread-loader，parallel-webpack，happypack 多进程打包

webpack 默认是通过 nodejs 运行的，所以是个单线程单进程的打包过程。我们也可以借助 node 的多进程进行打包，具体配置几个 cpu 打包，具体看业务。

- 8. 合理使用 sourceMap

- 9. 结合 stats 分析打包结果，发现哪个地方耗时多，针对优化

- 10.开发环境内存编译，webpack Devserver 不生成 dist 目录，内存读取肯定快

- 11.开发环境无用插件剔除，有些比如线上才用的压缩，开发就不需要使用。

### 5-9 多页面打包配置

多页面配置其实配置多个 HtmlWebpackPlugin 插件。

**到最后 webpack 的配置不仅仅是写配置，而是通过 node，做一些逻辑的判断，自动化的操作**

### 6-1 自定义 loader

假设场景：打包 index.js，判断代码如果有 kuro，就改为 kurosang。

开发：

loaders 本质就是一个函数，定义的时候不能用箭头函数，要用声明式的。

在 webpack 配置 loader 里 options 里面的字段，可以在 loader 函数里面通过 this.query 获取到

> options 已取代 query，所以此属性废弃。使用 loader-utils 中的 getOptions 方法来提取给定 loader 的 option。

**webpack 官方推荐使用 loader-utils 来代替 this.query**

`this.callback` API 可以帮助我们返回除了源代码 souce 之外的东西，比如 sourceMap

```
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

异步可以使用`this.async()`获取异步回调函数 callback，多个同步或者异步想要按顺序执行，只需记住 loader 执行顺序从下往上开始

如果想要简写 loader 的 path，简写成只写名字，可以配置 webpack.config

```
resolveLoader: {
    modules: ['node_modules', './loaders'],
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
            options: {
              name: 'sang', // 这里定义的参数，可以在loader里面获取到
            },
          },
          'replaceLoaderAsync',
        ],
      },
    ],
  },
```

当执行的时候，replaceLoaderAsync 的 loader 会先去 node_module 里面找，找不到就去 loaders 文件夹找

常见自定义 loader 思路：

1.异常捕获：检测 `function(){}`，统一在外面 `trycatch`，这样异常捕获这些非业务代码就不会侵入业务。

2.源代码使用占位符，比如 ¥a，使用 loader 统一打包的时候处理

一般是对源代码包装会用到，更多查询。

### 6-1 自定义 plugin

plugin 核心机制是一个设计模式：事件驱动又或者是发布订阅。

代码之间的执行是通过事件来驱动的

案例解析：在打包结束后，生成一个版权信息 copyright.txt 文件

开发：

loader 是一个函数，plugin 是一个类

constructor 用来接受 new Plugin({})的参数

apply 函数接收 webpack 实例 compiler

compiler.hooks 里面放的就是打包的生命周期，[更多](https://www.webpackjs.com/api/compiler-hooks/)

使用钩子的时候要去文档看是同步还是异步，如果是异步则使用`tapAsync`,
并且最后要调用回调函数。

打包生成的内容放在 compilation.assets 里

我们在开发时，想要知道钩子里 compilation.assets 的东西，除了 console.log 打印之外，还可以这样做：

```
//package.json

"scripts": {
    "debug": "node --inspect --inspect-brk node_modules/webpack/bin/webpack.js",
    "build": "webpack"
  },
```

debug 命令其实和 build 命令一样，只是 debug 命令是用 node 显示的去调用 webpack。

`--inspect`:表示我要开启 node 的调试工具
`--inspect-brk`：表示我在运行 webpack.js 执行时，第一行打断点

运行 debug 命令后，打开 chrome 的控制台，点击 node 图标。(这个其实就是 node 的调试工具)

我们在需要查看的地方前打一个断点`debugger`

### 6-3 手动写一个 bundle 实现类似 webpack 的部分功能

一。首先，对入口文件进行分析：

安装

@babel/parser : parser.parse 把字符串分析生成的其实就是 AST,抽象语法树

@babel/traverse : traverse 提取 ImportDeclaration 类型 AST,收集依赖的地址

@babel/core：babel.transformFromAst 转化 ast

@babel/preset-env：需要借助这个做转化，es6->ES5

这一步主要是一个 moduleAnalyser 的函数，就是分析模块（文件）

二。其他模块的信息分析

**Dependencies Graph(依赖图谱)**

makeDependenciesGraph 函数，通过调用 moduleAnalyser，生成一个只有入口文件一项的数组 graphArray，然后分析入口文件的 dependencies，循环它，调用 moduleAnalyser，将分析结果推入到 graphArray 里面

三。将 dependencies 生成真正可以在浏览器运行的代码

### 7vue-cli3

vue-cli3 里面直接把 webpack 封装到里面，我们不可以直接接触修改 webpack 的配置，但是 vue-cli3 封装了一套自己的配置来修改 webpack 配置。简单来说就是他把繁琐的 webpack 配置再做了一层封装。

[vue-cli](https://cli.vuejs.org/zh/config/#vue-config-js)

因此当我们用 vue 开发时就不需要懂 webpack 了。直接看文档，但要知道，理论上是 vue-cli 帮我们做了转化。

可能会有一个疑问，如果 vue-cli 的 api 满足不了我们的需求，我们想要修改 webpack 的配置怎么办？？

答案是 vue-cli3 里面的 configureWebpack 字段，允许我们直接写 webpack 配置，打包的时候会 merge 过去。
