const { DeptValidator } = require("../../validator/modules/deptValidator");
const { DeptService } = require("../../service/system/deptService");
const { ParametersException } = require("../../exception/httpException");
const { ResponseException } = require("../../exception/responseException");

class DeptController {
  // 新增部门
  async create(ctx, next) {
    const body = ctx.request.body;
    const message = await new DeptValidator().validatorCreate(body);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const department = await new DeptService().create({
      ...body,
    });
    await new ResponseException(ctx, next).successException(department);
  }
  // 删除部门
  async delDept(ctx, next) {
    const query = ctx.request.query;
    const message = await new DeptValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const department = await new DeptService().del(query.id);
    await new ResponseException(ctx, next).successException(department);
  }
  // 修改部门
  async update(ctx, next) {
    const body = ctx.request.body;
    const message = await new DeptValidator().isMissingParameterValidator(
      body,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const department = await new DeptService().update({
      ...body,
    });
    await new ResponseException(ctx, next).successException(department);
  }
  // 查询部门
  async findAll(ctx, next) {
    const body = ctx.request.body;
    const list = await new DeptService().findAll({
      ...body,
    });
    await new ResponseException(ctx, next).successException(list);
  }
  // 查询部门-树形结构
  async getDeptList(ctx, next) {
    const body = ctx.request.body;
    const treeList = await new DeptService().getDeptList({
      ...body,
    });
    await new ResponseException(ctx, next).successException(treeList);
  }
  // 查询部门-详情
  async getDept(ctx, next) {
    const query = ctx.request.query;
    const message = await new DeptValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const dept = await new DeptService().getDept(query);
    await new ResponseException(ctx, next).successException(dept);
  }
}
module.exports = new DeptController();
