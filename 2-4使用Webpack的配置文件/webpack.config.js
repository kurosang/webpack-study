const path = require("path");

module.exports = {
  mode: "development", // 默认pro
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
