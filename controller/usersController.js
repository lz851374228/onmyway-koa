const { UsersValidator } = require("../validator/modules/usersValidator");
const { UserService } = require("../service/usersService");
const { ParametersException } = require("../exception/httpException");
const { ResponseException } = require("../exception/responseException");

class UsersController {
  // 注册
  async register(ctx, next) {
    const body = ctx.request.body;
    let message = await new UsersValidator().validatorRegister(body);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const [user, created] = await new UserService().createUser({
      ...body,
      password: body.password1,
    });
    if (created) {
      await new ResponseException(ctx, next).successException(user);
    }
  }
  // 登录
  async login(ctx, next) {
    const body = ctx.request.body;
    const message = await new UsersValidator().validatorLogin(body);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    await new ResponseException(ctx, next).successException(true);
  }
  // 验证用户是否存在
  async isUserExist(ctx, next) {
    const query = ctx.request.query;
    const message = await new UsersValidator().validatorUsername(
      query.username
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const user = await new UserService().findOneUser(query.username);
    if (!user) {
      await new ResponseException(ctx, next).successException(false);
    } else {
      await new ResponseException(ctx, next).successException(true);
    }
  }
  // 查询用户信息-通过用户名
  async findOneUserByusername(ctx, next) {
    const query = ctx.request.query;
    const message = await new UsersValidator().validatorUsername(query.username);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const user = await new UserService().findOneUser(query.username);
    if (!user) {
      throw new ParametersException('用户不存在');
    } else {
      await new ResponseException(ctx, next).successException(user);
    }
  }
  // 查询用户信息
  async findUsers(ctx,next){
    const body=ctx.request.body
    // const message = await new UsersValidator().validatorUsername(query.username);
    // if (message.length > 0) {
    //   throw new ParametersException(message);
    // }
    const users=await new UserService().findUsers(body)
    await new ResponseException(ctx, next).successException(users);
  }
  // 修改用户信息
  async updateUser(ctx,next){
    const body=ctx.request.body
    const users=await new UserService().updateUser(body)
    await new ResponseException(ctx, next).successException(users);
  }
  // 删除用户信息
  async deleteUser(ctx,next){
    const body=ctx.request.body
    const users=await new UserService().deleteUser(body)
    await new ResponseException(ctx, next).successException(users);
  }
}
module.exports = new UsersController();
