const { MenuValidator } = require("../../validator/modules/menuValidator");
const { MenuService } = require("../../service/system/menuService");
const { ParametersException } = require("../../exception/httpException");
const { ResponseException } = require("../../exception/responseException");

class DeptController {
  // 新增菜单
  async create(ctx, next) {
    const body = ctx.request.body;
    const message = await new MenuValidator().isMissingParameterValidator(
      body,
      ["name", "type", "order", "path", "icon"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const menu = await new MenuService().create({
      ...body,
    });
    await new ResponseException(ctx, next).successException(menu);
  }
  // 修改菜单
  async update(ctx, next) {
    const body = ctx.request.body;
    const message = await new MenuValidator().isMissingParameterValidator(
      body,
      ["id", "name", "type", "order", "path", "icon"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const menu = await new MenuService().update({
      ...body,
    });
    await new ResponseException(ctx, next).successException(menu);
  }
  // 删除菜单
  async del(ctx, next) {
    const body = ctx.request.body;
    const message = await new MenuValidator().isMissingParameterValidator(
      body,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const menu = await new MenuService().del(body.id);
    await new ResponseException(ctx, next).successException(menu);
  }
  // 查询菜单-树形结构
  async findAllTree(ctx, next) {
    const body = ctx.request.body;
    const treeList = await new MenuService().findAllTree({
      ...body,
    });
    await new ResponseException(ctx, next).successException(treeList);
  }
  // 获取路由
  async getRoutes(ctx, next) {
    const tokenPayload = ctx.request.tokenPayload;
    const treeList = await new MenuService().getRoutes(tokenPayload);
    await new ResponseException(ctx, next).successException(treeList);
  }
  // 获取菜单列表
  async getMenuList(ctx, next) {
    const body = ctx.request.query;
    const treeList = await new MenuService().getMenuList({
      ...body,
    });
    await new ResponseException(ctx, next).successException(treeList);
  }
}
module.exports = new DeptController();
