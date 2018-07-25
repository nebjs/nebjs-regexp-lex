const LexContext = require('./LexContext');
const newLineReg = /(?:\r\n)|\r|\n/;
const newLineRegBegin = /^(?:(?:\r\n)|\r|\n)/;

/**
 * 构造词法分析器类
 */
class Lexer {
  /**
   * 构造词法分析器对象
   * @param context
   */
  constructor(context) {
    if (!(context && context instanceof LexContext)) throw new TypeError('context must be a LexContext object');
    this.context = context;
  }

  /**
   * 获取词法表
   * @param codeStr
   * @return {Object}
   * {
   *  nameList: [], 字符串表
   * }
   */
  getLex(codeStr) {
    if (!codeStr || typeof codeStr !== 'string') throw new TypeError('codeStr must be a string');
    const {context} = this, {regTokenList} = context;
    let code = codeStr.slice(0), index = 0, i = 0, j = 0;
    const lexList = [], errors = [], ctx = {lexList, errors, code: code}, back = {lexList, errors};
    for (const regToken of regTokenList) {
      const {begin} = regToken;
      if (begin) begin({context, ctx, back});
    }
    while (ctx.code.length > 0) {
      let ok = false;
      for (const regToken of regTokenList) {
        const {regExp, newLine, type, val, dispose} = regToken, match = regExp.exec(ctx.code);
        if (match) {
          const mat = match[0], mLen = mat.length;
          if (mLen > 0) {
            if (dispose) {
              const lex = {i, j, index, type, val};
              if (dispose({match, lex, context, ctx, back}) !== false) lexList.push(lex);
            }
            j += mLen;
            if (newLine) {
              let matchNewLine, matCode = mat.slice(0);
              while (matchNewLine = newLineReg.exec(matCode)) {
                i++;
                j = 0;
                matCode = matCode.slice(matchNewLine[0].length);
                if (matCode.length === 0) break;
              }
            }
            index += mLen;
            ctx.code = ctx.code.slice(mLen);
            ok = true;
          }
        }
      }
      if (!ok) {
        let isMatch = false, match;
        while (match = newLineRegBegin.exec(code)) {
          const mat = match[0], mLen = mat.length;
          isMatch = true;
          ctx.code = ctx.code.slice(mLen);
          i++;
          j = 0;
        }
        if (!isMatch) {
          j++;
          index++;
          ctx.code = ctx.code.slice(1);// 当出现无法识别的情形时，尝试一直往后
          errors.push({i, j, index});
        }
      }
    }
    return back;
  };
}

module.exports = Lexer;
