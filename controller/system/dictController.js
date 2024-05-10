const { CustomValidator } = require("../../validator/index");
const { DictService } = require("../../service/system/dictService");
const { ParametersException } = require("../../exception/httpException");
const { ResponseException } = require("../../exception/responseException");

class DeptController {
  // 新增字典
  async create(ctx, next) {
    const body = ctx.request.body;
    const message = await new CustomValidator().isMissingParameterValidator(body,['name','code','order']);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const department = await new DictService().create({
      ...body,
    });
    await new ResponseException(ctx, next).successException(department);
  }
  // 删除字典
  async del(ctx, next) {
    const query = ctx.request.query;
    const message = await new CustomValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const department = await new DictService().del(query.id);
    await new ResponseException(ctx, next).successException(department);
  }
  // 修改字典
  async update(ctx, next) {
    const body = ctx.request.body;
    const message = await new CustomValidator().isMissingParameterValidator(
      body,
      ["id","name","code","order"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const department = await new DictService().update({
      ...body,
    });
    await new ResponseException(ctx, next).successException(department);
  }
  // 查询字典-全部
  async findAll(ctx, next) {
    const body = ctx.request.body;
    const list = await new DictService().findAll({
      ...body,
    });
    await new ResponseException(ctx, next).successException(list);
  }
  // 查询字典-分页-树形结构
  async getDictList(ctx, next) {
    const body = ctx.request.body;
    const treeList = await new DictService().getDictList({
      ...body,
    });
    await new ResponseException(ctx, next).successException(treeList);
  }
  // 查询字典-详情
  async getDict(ctx, next) {
    const query = ctx.request.query;
    const message = await new CustomValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const dept = await new DictService().getDept(query);
    await new ResponseException(ctx, next).successException(dept);
  }
}
module.exports = new DeptController();
