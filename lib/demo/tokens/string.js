const begin = function ({context, ctx, back}) {
  const stringInfo = {}, stringList = [];
  back.stringInfo = stringInfo;
  back.stringList = stringList;
  ctx.stringInfo = stringInfo;
  ctx.stringList = stringList;
};
const dispose = function ({match, lex, context, ctx}) {
  const name = match[1] || match[2], {stringInfo, stringList} = ctx;
  if (stringInfo[name] !== undefined) {
    lex.val = stringInfo[name];
  } else {
    const id = {name, index: stringList.length};
    lex.val = id.index;
    stringInfo[name] = id;
    stringList.push(id);
  }
};
const tokens = [{name: 'string', newLine: true, type: 2, regExp: /^(?:(?:'(.*)')|(?:"(.*)"))/, begin, dispose}];
module.exports = tokens;
