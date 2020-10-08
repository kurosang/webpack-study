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
