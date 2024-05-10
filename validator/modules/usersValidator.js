const validator = require("validator");
const bcrypt = require("bcryptjs");
const { CustomValidator } = require("../index");
const { UserService } = require("../../service/system/usersService");

class UsersValidator extends CustomValidator {
  constructor() {
    super();
  }
  // 用户名校验
  async validatorUsername(username) {
    if (validator.isEmpty(username)) {
      this.message.push("用户名不能为空");
    }
    if (!validator.matches(username, /^[a-zA-Z0-9]{4,16}$/)) {
      this.message.push("用户名不符合规范，需要4到16位字母");
    }
    return this.message;
  }
  // 密码校验
  async validatorPassword(password) {
    if (validator.isEmpty(password)) {
      this.message.push("密码不能为空");
    }
    if (
      !validator.matches(
        password,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,16}$/
      )
    ) {
      this.message.push(
        "密码不符合规范，至少8-16个字符，至少1个大写字母，1个小写字母和1个数字"
      );
    }
    return this.message;
  }
  // 新增账号
  async validatorCreate(params) {
    await this.isMissingParameterValidator(params, [
      "username",
      "phone",
      "nickname",
    ]);
    const user = await new UserService().findOneUser(params.username);
    if (user) {
      this.message.push("用户名已被注册，请重新输入");
    }
    return this.message;
  }
  // 用户注册校验
  async validatorRegister(params) {
    await this.isMissingParameterValidator(params, [
      "username",
      "password",
      "password2",
      "phone",
    ]);
    const user = await new UserService().findOneUser(params.username);
    if (user) {
      this.message.push("用户名已被注册，请重新输入！");
    }
    await this.validatorPassword(params.password);
    if (!validator.equals(params.password, params.password2)) {
      this.message.push("两次输入的密码不一致");
    }
    return this.message;
  }
  // 用户登录校验
  async validatorLogin(params) {
    await this.isMissingParameterValidator(params, ["username", "password"]);
    const user = await new UserService().findOneUser(params.username);
    if (!user) {
      this.message.push("用户不存在，请注册");
      return this.message;
    } else if (user.status == 1) {
      this.message.push("当前用户账号已被停用，请联系管理员！");
    }
    const isBcrypt = await bcrypt.compareSync(params.password, user.password);
    if (!isBcrypt) {
      this.message.push("密码错误");
      return this.message;
    }
    return this.message;
  }
}
module.exports = { UsersValidator };
