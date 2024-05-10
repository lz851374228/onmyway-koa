const { RoleValidator } = require("../../validator/modules/roleValidator");
const { RoleService } = require("../../service/system/roleService");
const { ParametersException } = require("../../exception/httpException");
const { ResponseException } = require("../../exception/responseException");

class RoleController {
  // 新增角色
  async create(ctx, next) {
    const body = ctx.request.body;
    const message = await new RoleValidator().validatorCreateRole(body);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const role = await new RoleService().createRole({
      ...body,
    });
    await new ResponseException(ctx, next).successException();
  }
  // 修改角色
  async update(ctx, next) {
    const body = ctx.request.body;
    const message = await new RoleValidator().validatorUpdateRole(body);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const role = await new RoleService().updateRole({
      ...body,
    });
    await new ResponseException(ctx, next).successException(role);
  }
  // 查询角色-详情
  async read(ctx, next) {
    const query = ctx.request.query;
    const message = await new RoleValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const role = await new RoleService().getRoleDetails(query.id);
    await new ResponseException(ctx, next).successException(role);
  }
  // 删除角色
  async del(ctx, next) {
    const query = ctx.request.query;
    const message = await new RoleValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    await new RoleService().deleteRole(query.id);
    await new ResponseException(ctx, next).successException();
  }
  // 查询角色-列表
  async list(ctx, next) {
    const query = ctx.request.query;
    const message = await new RoleValidator().isMissingParameterValidator(
      query,
      ["page", "pageSize"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const roles = await new RoleService().getRoleListByPage({
      ...query,
    });
    await new ResponseException(ctx, next).successException(roles);
  }
  // 查询角色-全部
  async findAll(ctx, next){
    const query = ctx.request.query;
    const roles = await new RoleService().findAll({
      ...query,
    });
    await new ResponseException(ctx, next).successException(roles);
  }
  // 设置角色状态
  async setRoleStatus(ctx, next) {
    const body=ctx.request.body
    const message = await new RoleValidator().isMissingParameterValidator(
      body,
      ["id", "status"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const role = await new RoleService().setRoleStatus(body);
    await new ResponseException(ctx, next).successException(role);
  }
  // 判断角色编码是否存在
  async userExist(ctx,next){
    
  }
}
module.exports = new RoleController();
