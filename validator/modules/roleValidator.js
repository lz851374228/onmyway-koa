const validator = require("validator");
const bcrypt = require("bcryptjs");
const { CustomValidator } = require("../index");
const { RoleService } = require("../../service/system/roleService");

class RoleValidator extends CustomValidator {
  constructor() {
    super();
  }
  // 新增角色
  async validatorCreateRole(params) {
    await this.isMissingParameterValidator(params, ["name", "code", "order"]);
    const user = await new RoleService().findOneRoleByCode(params.code);
    if (user) {
      this.message.push("角色编码已存在，请重新输入！");
    }
    return this.message;
  }
  // 修改角色
  async validatorUpdateRole(params) {
    await this.isMissingParameterValidator(params, [
      "id",
      "name",
      "code",
      "order",
    ]);
    const user = await new RoleService().findOneRoleByCode(params.code);
    if (user && params.id !== user.id) {
      this.message.push("角色编码已存在，请重新输入！");
    }
    return this.message;
  }
}
module.exports = { RoleValidator };
