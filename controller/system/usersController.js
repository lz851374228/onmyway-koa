const { UsersValidator } = require("../../validator/modules/usersValidator");
const { UserService } = require("../../service/system/usersService");
const { ParametersException } = require("../../exception/httpException");
const { ResponseException } = require("../../exception/responseException");
const { Auth } = require("../../middlewares/auth");

class UsersController {
  // 新增用户
  async create(ctx, next) {
    const body = ctx.request.body;
    const message = await new UsersValidator().validatorCreate(body);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const user = await new UserService().create({
      ...body,
    });
    await new ResponseException(ctx, next).successException();
  }

  // 修改用户
  async update(ctx, next) {
    const body = ctx.request.body;
    const message = await new UsersValidator().isMissingParameterValidator(
      body,
      ["id", "phone", "nickname"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const user = await new UserService().update({
      ...body,
    });
    await new ResponseException(ctx, next).successException();
  }

  // 查询用户-详情
  async read(ctx, next) {
    const query = ctx.request.query;
    const message = await new UsersValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const user = await new UserService().read(query.id);
    await new ResponseException(ctx, next).successException(user);
  }

  // 删除用户
  async del(ctx, next) {
    const query = ctx.request.query;
    const message = await new UsersValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const user = await new UserService().del(query.id);
    await new ResponseException(ctx, next).successException();
  }

  // 查询用户-列表
  async listByPage(ctx, next) {
    const query = ctx.request.query;
    const message = await new UsersValidator().isMissingParameterValidator(
      query,
      ["page", "pageSize"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const users = await new UserService().getUserListByPage({
      ...query,
    });
    await new ResponseException(ctx, next).successException(users);
  }

  // 注册
  async register(ctx, next) {
    const body = ctx.request.body;
    const message = await new UsersValidator().validatorRegister(body);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const user = await new UserService().register({
      ...body,
    });
    await new ResponseException(ctx, next).successException();
  }

  // 登录
  async login(ctx, next) {
    const body = ctx.request.body;
    const message = await new UsersValidator().validatorLogin(body);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const user = await new UserService().findOneUser(body.username);
    const token = await new Auth().setToken(user.toJSON());
    await new ResponseException(ctx, next).successException({ token });
  }

  // 获取用户信息
  async getUserInfo(ctx, next) {
    const tokenPayload = ctx.request.tokenPayload;
    const user = await new UserService().getUserInfo(tokenPayload.id);
    await new ResponseException(ctx, next).successException(user);
  }

  // 获取权限标识
  async getPermCode(ctx, next) {
    await new ResponseException(ctx, next).successException([
      "1000",
      "3000",
      "5000",
    ]);
  }

  // 验证用户是否存在
  async userExist(ctx, next) {
    const body = ctx.request.body;
    const message = await new UsersValidator().isMissingParameterValidator(
      body,
      ["username"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const role = await new UserService().findOneUser(body.username);
    if (role) {
      throw new ParametersException(["当前用户名已存在，请重新输入!"]);
    } else {
      await new ResponseException(ctx, next).successException(
        "当前用户名可以使用"
      );
    }
  }
}
module.exports = new UsersController();
