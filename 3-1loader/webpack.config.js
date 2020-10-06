const path = require("path");

module.exports = {
  mode: "development", // 默认pro
  entry: {
    main: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
