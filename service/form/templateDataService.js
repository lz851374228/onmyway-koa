const { Op } = require("sequelize");
const _ = require("lodash");
const { sequelize } = require("../../utils/db-mysql");
const { Service } = require("../index");
const { TemplateData } = require("../../models/form/templateModel");
const { ParametersException } = require("../../exception/httpException");

class TemplateDataService extends Service {
  constructor() {
    super();
  }
  // 新增
  async create(params) {
    return await sequelize.transaction(async (t) => {
      let valueObject = await this.getObject(params, [
        "form_template_id",
        "form_data",
        "addition",
      ]);
      return await TemplateData.create(valueObject, {
        transaction: t,
      });
    });
  }

  // 修改
  async update(params) {
    return await sequelize.transaction(async (t) => {
      let valueObject = await this.getObject(params, [
        "form_template_id",
        "form_data",
        "addition",
      ]);
      return await TemplateData.update(valueObject, {
        where: {
          id: params.id,
        },
        transaction: t,
      });
    });
  }

  // 删除
  async del(id) {
    return await sequelize.transaction(async (t) => {
      return await TemplateData.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });
    });
  }

  // 查询-列表
  async getList(params) {
    let whereObject = await this.getObject(params, [
      "id",
      "form_template_id"
    ]);
    return await TemplateData.findAll({
      where: whereObject,
      ...(await this.getPage(params)),
      raw: true,
    });
  }

  // 查询-详情
  async getTemplateData(params) {
    return sequelize.transaction(async (t) => {
      return await TemplateData.findOne({
        where: {
          id: params.id,
        },
      });
    });
  }
}

module.exports = { TemplateDataService };
