const nebUtil = require('nebjs-util');
const objCopy = nebUtil.object.copy;

/**
 * 构造词法分析器环境类
 */
class LexContext {
  /**
   * 构造词法分析器环境对象
   */
  constructor() {
    this.regTokenInfo = {};
    this.regTokenList = [];
  }

  /**
   * 注册Token
   * @param tokens
   * @return {Number}
   * [{
   *  name: '', 注册词法单元名称
   *  regExp: /^$/, 注册正则
   *  newLine: false, 可能包含有换行符
   *  register: function(this){}, 注册时触发些方法
   *  begin: function(){}, 处理词法前初始方法
   *  dispose: function(){}, 处理词法单元方法
   *  type: '', 词法单元类型
   *  val: '', 词法单元值
   * },..]
   * @return {Number} 成功注册的词法单元数量
   */
  registerTokens(tokens) {
    const {regTokenInfo, regTokenList} = this;
    if (!(tokens && Array.isArray(tokens) && tokens.length > 0)) throw new TypeError('tokens must be a non-empty array');
    let num = 0;
    for (const token of tokens) {
      if (!(token && token.constructor === Object)) throw new TypeError('token must be a object');
      const regToken = objCopy({}, token, {deep: true});
      const {name, regExp, newLine, begin, dispose, register} = regToken;
      if (!(name && typeof name === 'string' && name.length > 0)) throw new TypeError('token\'s name must be a non-empty string');
      const mapVal = regTokenInfo[name];
      if (mapVal) throw new TypeError('token ' + name + ' have already registered');
      if (newLine && typeof newLine !== 'boolean') throw new TypeError('token\'s newLine must be a boolean');
      if (!(regExp && regExp.constructor === RegExp)) throw new TypeError('token\'s regExp must be a RegExp');
      if (begin && typeof begin !== 'function') throw new TypeError('token ' + name + '\'s begin must be a function');
      if (dispose && typeof dispose !== 'function') throw new TypeError('token ' + name + '\'s dispose must be a function');
      if (register) {
        if (typeof register !== 'function') throw new TypeError('token ' + name + '\'s dispose must be a function');
        register(this);
      }
      regToken.index = regTokenList.length;
      regTokenInfo[name] = regToken;
      regTokenList.push(regToken);
      num++;
    }
    return num;
  }
}

module.exports = LexContext;
