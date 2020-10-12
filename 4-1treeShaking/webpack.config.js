const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development', // 默认pro
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: './src/index.js',
  },
  devServer: {
    contentBase: './dist',
    open: true, // 启动之后自动打开浏览器
    port: 8080,
    hot: true,
    hotOnly: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // options: {
        //   // presets: [
        //   //   [
        //   //     '@babel/preset-env',
        //   //     {
        //   //       targets: {
        //   //         chrome: '67',
        //   //       },
        //   //       useBuiltIns: 'usage',
        //   //     },
        //   //   ],
        //   // ],
        //   plugins: [
        //     [
        //       '@babel/plugin-transform-runtime',
        //       {
        //         corejs: 2,
        //         helpers: true,
        //         regenerator: true,
        //         useESModules: false,
        //       },
        //     ],
        //   ],
        // },
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            // placeholder 占位符
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 20480, //20kb
          },
        },
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: 'file-loader',
        },
      },
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
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    usedExports: true,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
}
