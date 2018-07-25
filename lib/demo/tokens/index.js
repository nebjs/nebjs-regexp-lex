const blank = require('./blank');
const identifier = require('./identifier');
const string = require('./string');
const symbol = require('./symbol');
const tokens = [
  ...blank,
  ...identifier,
  ...string,
  ...symbol
];
module.exports = tokens;
