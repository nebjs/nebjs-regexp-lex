/**
 * 注册关键字
 * @param context
 * @param keywords
 * [{
 *  name: '', 注册关键字名称
 *  val: '', 关键字值
 * },..]
 * @return {Number} 成功注册的关键字数量
 */
const registerKeywords = function (context, keywords) {
  const {keywordInfo, keywordList} = context;
  if (!(keywords && Array.isArray(keywords) && keywords.length > 0)) throw new TypeError('keywords must be a non-empty array');
  let num = 0;
  for (const keyword of keywords) {
    if (!(keyword && keyword.constructor === Object)) throw new TypeError('keyword must be a object');
    const regKeyword = Object.assign({}, keyword);
    const {name, val} = regKeyword;
    if (!(name && typeof name === 'string' && name.length > 0)) throw new TypeError('keyword name must be a non-empty array');
    if (!(val !== undefined && typeof val === 'number')) throw new TypeError('keyword val must be a number');
    let key = keywordInfo[keyword];
    if (key) throw new TypeError('keyword ' + name + ' have already registered');
    regKeyword.index = keywordList.length;
    keywordInfo[name] = regKeyword;
    keywordList.push(regKeyword);
    num++;
  }
  return num;
};
const register = function (context) {
  context.keywordInfo = {};
  context.keywordList = [];
  context.constructor.prototype['registerKeywords'] = registerKeywords;
  registerKeywords(context, [{name: 'var', val: 0}, {name: 'if', val: 1}, {name: 'then', val: 2}, {name: 'else', val: 3}]);
};
const begin = function ({context, ctx, back}) {
  const identifierInfo = {}, identifierList = [];
  back.identifierInfo = identifierInfo;
  back.identifierList = identifierList;
  back.keywordList = context.keywordList;
  back.keywordInfo = context.keywordInfo;
  ctx.identifierInfo = identifierInfo;
  ctx.identifierList = identifierList;
};
const dispose = function ({match, lex, context, ctx}) {
  const {keywordInfo} = context, name = match[1], key = keywordInfo[name];
  if (key) {
    lex.type = 0;
    lex.val = key.val;
    lex.keyword = key.index;
  } else {
    const {identifierInfo, identifierList} = ctx;
    lex.type = 1;
    if (identifierInfo[name] !== undefined) {
      lex.val = identifierInfo[name];
    } else {
      const id = {name, index: identifierList.length};
      lex.val = id.index;
      identifierInfo[name] = id;
      identifierList.push(id);
    }
  }
};
const tokens = [{name: 'identifier', regExp: /^(\w*)/, register, begin, dispose}];
module.exports = tokens;
