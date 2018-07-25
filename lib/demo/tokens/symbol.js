const symbolValue = function (str) {
  const len = str.length;
  let num = 0;
  for (let i = 0; i < len; ++i) {
    num += (str.charCodeAt(len - i - 1) << i);
  }
  return num;
};
/**
 * 注册符号
 * @param context
 * @param symbols
 * [{
 *  name: '', 注册符号名称
 *  val: '', 符号值
 * },..]
 * @return {Number} 成功注册的符号数量
 */
const registerSymbols = function (context, symbols) {
  const {symbolInfo, symbolList} = context;
  if (!(symbols && Array.isArray(symbols) && symbols.length > 0)) throw new TypeError('symbols must be a non-empty array');
  let num = 0;
  for (const symbol of symbols) {
    if (!(symbol && symbol.constructor === Object)) throw new TypeError('symbol must be a object');
    const regSymbol = Object.assign({}, symbol);
    const {name, val} = regSymbol;
    if (!(name && typeof name === 'string' && name.length > 0)) throw new TypeError('symbol name must be a non-empty array');
    if (val === undefined) {
      regSymbol.val = symbolValue(name);
    } else if (typeof val !== 'number') throw new TypeError('symbol val must be a number');
    let key = symbolInfo[symbol];
    if (key) throw new TypeError('symbol ' + name + ' have already registered');
    regSymbol.index = symbolList.length;
    symbolInfo[name] = regSymbol;
    symbolList.push(regSymbol);
    num++;
  }
  return num;
};
const register = function (context) {
  context.symbolInfo = {};
  context.symbolList = [];
  context.constructor.prototype['registerSymbols'] = registerSymbols;
};
const begin = function ({context, ctx, back}) {
  back.symbolList = context.symbolList;
  back.symbolInfo = context.symbolInfo;
};
const dispose = function ({match, lex, context}) {
  const {symbolInfo, symbolList} = context, name = match[1];
  let symbol = symbolInfo[name];
  if (!symbol) {
    symbol = {name, val: symbolValue(name)};
    symbol.index = symbolList.length;
    symbolInfo[name] = symbol;
    symbolList.push(symbol);
  }
  lex.val = symbol.val;
  lex.symbol = symbol.index;
};
module.exports = [{name: 'symbol', type: 3, regExp: /^((?:<=)|(?:>=)|[><=+\-*/%{}\[\];])*/, register, begin, dispose}];
