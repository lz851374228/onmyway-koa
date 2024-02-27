const validator = require("validator");
const { CustomValidator } = require("../index");
const { IntegralService } = require("../../service/integralService");

class IntegralValidator extends CustomValidator {
  constructor() {
    super();
  }
  async validatorCreate(params){
    await this.isMissingParameterValidator(params, [
      "name",
      "num",
      "type"
    ]);
    if(!validator.isInt(params.num+'')){
      this.message.push('分值:请输入整数')
    }
    return this.message;
  }
  
}
module.exports = { IntegralValidator };
