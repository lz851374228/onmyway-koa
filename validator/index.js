const validator = require("validator");
const _ = require("lodash");
const { ParametersException } = require("../exception/httpException");

class CustomValidator {
  constructor() {
    this.message = [];
  }
  // 校验：参数缺失校验
  async isMissingParameterValidator(params, keyList) {
    const message = [];
    keyList.forEach((item) => {
      if(!_.has(params, item)){
        message.push(`${item}字段缺失`);
      }
    });
    if (message.length > 0) {
      this.message = [...this.message, ...message];
      throw new ParametersException(message);
    } else {
      return this.message;
    }
  }
  // 校验：手机号格式校验
  async isMobile(str) {
    const is = validator.matches(
      str,
      /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    );
    if (!is) {
      this.message.push("手机格式不正确");
    }
    return this.message;
  }
}
module.exports = { CustomValidator };
