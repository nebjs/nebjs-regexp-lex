const LexContext = require('../core/LexContext');
const tokens = require('./tokens/index');

class DemoLexContext extends LexContext {
  /**
   * 构造词法分析器对象
   * @param context
   */
  constructor(context) {
    super(context);
    this.registerTokens(tokens);
  }
}

module.exports = DemoLexContext;
