const config = require("./base.config.js");
const path = require('path');
const serverConfig = {
  ...config,
  output: {
    path: path.resolve(__dirname, '../build/dev'),
    filename: 'nebjs-regexp-lex.js',
    libraryTarget: 'umd',
  },
  mode: "development",
  target: "node",
  devtool: "none" // eval-source-map
};
module.exports = [serverConfig];
