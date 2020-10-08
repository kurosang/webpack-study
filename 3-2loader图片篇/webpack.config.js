const path = require("path");

module.exports = {
  mode: "development", // 默认pro
  entry: {
    main: "./src/index.js",
  },
  module: {
    rules: [
      // {
      //   test: /\.(jpg|png|gif)$/,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       // placeholder 占位符
      //       name: "[name].[ext]",
      //       outputPath: "images/",
      //     },
      //   },
      // },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            // placeholder 占位符
            name: "[name].[ext]",
            outputPath: "images/",
            limit: 10240, //10kb
          },
        },
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
