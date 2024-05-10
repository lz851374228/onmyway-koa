const validator = require("validator");
const { CustomValidator } = require("../index");

class DeptValidator extends CustomValidator {
  constructor() {
    super();
  }
  // 校验ID
  async validatorId(params) {
    await this.isMissingParameterValidator(params, [
      "id",
    ]);
    return this.message;
  }
  // 新增部门
  async validatorCreate(params) {
    await this.isMissingParameterValidator(params, [
      "name",
      "order",
    ]);
    return this.message;
  }
  
}
module.exports = { DeptValidator };
