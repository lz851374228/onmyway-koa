const { Op } = require("sequelize");
const _ = require("lodash");
const { sequelize } = require("../../utils/db-mysql");
const { Service } = require("../index");
const { Template } = require("../../models/form/templateModel");
const { ParametersException } = require("../../exception/httpException");

class TemplateService extends Service {
  constructor() {
    super();
  }
  // 新增
  async create(params) {
    return await sequelize.transaction(async (t) => {
      let valueObject = await this.getObject(params, [
        "name",
        "type",
        "schemas",
        "status",
        "remark",
      ]);
      return await Template.create(valueObject, {
        transaction: t,
      });
    });
  }

  // 修改
  async update(params) {
    return await sequelize.transaction(async (t) => {
      let valueObject = await this.getObject(params, [
        "name",
        "type",
        "schemas",
        "status",
        "remark",
      ]);
      return await Template.update(valueObject, {
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
      return await Template.destroy({
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
      {
        key: "name",
        getValue: (value) => {
          return {
            [Op.substring]: value,
          };
        },
      },
      "type",
      "status",
    ]);

    return await Template.findAll({
      where: whereObject,
      ...(await this.getPage(params)),
      raw: true,
    });
  }

  // 查询-详情
  async getTemplate(params) {
    return sequelize.transaction(async (t) => {
      return await Template.findOne({
        where: {
          id: params.id,
        },
      });
    });
  }
}

module.exports = { TemplateService };
