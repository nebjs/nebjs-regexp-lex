const path = require('path');
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: './lib/index.js',
  module: {
    rules: [
      {test: /\.js$/, enforce: 'pre', loader: 'eslint-loader', exclude: /node_modules/},
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
    ]
  },
  performance: {hints: false}
};
