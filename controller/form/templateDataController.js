const { CustomValidator } = require("../../validator");
const { TemplateDataService } = require("../../service/form/templateDataService");
const { ParametersException } = require("../../exception/httpException");
const { ResponseException } = require("../../exception/responseException");

class TemplateController {
  // 新增
  async create(ctx, next) {
    const body = ctx.request.body;
    const message = await new CustomValidator().isMissingParameterValidator(body,['form_template_id']);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const template = await new TemplateDataService().create({
      ...body,
    });
    await new ResponseException(ctx, next).successException(template);
  }
  // 删除
  async del(ctx, next) {
    const query = ctx.request.query;
    const message = await new CustomValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const department = await new TemplateDataService().del(query.id);
    await new ResponseException(ctx, next).successException(department);
  }
  // 修改
  async update(ctx, next) {
    const body = ctx.request.body;
    const message = await new CustomValidator().isMissingParameterValidator(
      body,
      ["id","form_template_id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const department = await new TemplateDataService().update({
      ...body,
    });
    await new ResponseException(ctx, next).successException(department);
  }
  // 查询-列表
  async getList(ctx, next) {
    const body = ctx.request.body;
    const message = await new CustomValidator().isMissingParameterValidator(
      body,
      ["page","pageSize"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const list = await new TemplateDataService().getList({
      ...body,
    });
    await new ResponseException(ctx, next).successException(list);
  }
  // 查询-详情
  async getTemplateData(ctx, next) {
    const query = ctx.request.query;
    const message = await new CustomValidator().isMissingParameterValidator(
      query,
      ["id"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const dept = await new TemplateDataService().getTemplateData(query);
    await new ResponseException(ctx, next).successException(dept);
  }
}
module.exports = new TemplateController();
