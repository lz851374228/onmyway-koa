const { Op } = require("sequelize");
const _ = require("lodash");
const { sequelize } = require("../../utils/db-mysql");
const { Service } = require("../index");
const { Department, DepartmentUser } = require("../../models/system/deptModel");
const { Dict } = require("../../models/system/dictModel");
const { ParametersException } = require("../../exception/httpException");

class DictService extends Service {
  constructor() {
    super();
  }
  // 新增字典
  async create(params) {
    return await sequelize.transaction(async (t) => {
      let valueObject = await this.getObject(params, [
        "parent_id",
        "name",
        "code",
        "order",
        "remark",
      ]);
      if (params.parent_id) {
        const parentDict = await Dict.findOne({
          where: {
            id: params.parent_id,
          },
        });
        if (parentDict == null) {
          throw new ParametersException(
            "上级字典层级不存在，无法插入当前数据！"
          );
        }
      }
      return await Dict.create(valueObject, {
        transaction: t,
      });
    });
  }

  // 修改字典
  async update(params) {
    return await sequelize.transaction(async (t) => {
      if (params.parent_id) {
        const parentDict = await Dict.findOne({
          where: {
            id: params.parent_id,
          },
        });
        if (parentDict == null) {
          throw new ParametersException(
            "上级字典层级不存在，无法修改当前数据！"
          );
        }
      }
      let valueObject = await this.getObject(params, [
        "parent_id",
        "name",
        "code",
        "order",
        "remark",
      ]);
      return await Dict.update(valueObject, {
        where: {
          id: params.id,
        },
        transaction: t,
      });
    });
  }

  // 删除字典
  async del(id) {
    return await sequelize.transaction(async (t) => {
      let childrenDict = await Dict.findAll({
        where: {
          parent_id: id,
        },
      });
      if (childrenDict && childrenDict.length > 0) {
        throw new ParametersException("当前字典存在下级字典，请先删除下级字典");
      }
      return await Dict.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });
    });
  }

  // 查询字典
  async findAll(params) {
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
      "code",
      "status",
      "remark",
    ]);

    return await Dict.findAll({
      where: whereObject,
      ...(await this.getPage(params)),
      raw: true,
    });
  }

  // 查询部门-树形结构
  async getDictList(params) {
    return new Promise(async (resolve) => {
      if (!params.parent_id && !params.id) {
        params.parent_id = 0;
      }
      let whereObject = await this.getObject(params, [
        "id",
        "parent_id",
        "name",
      ]);
      let dicts = await Dict.findAll({
        where: whereObject,
        raw: true,
      });
      let list = [...dicts];
      let treeList = [];
      if (list.length > 0) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          element.children = await this.getDepartmentChildren(element.id);
          treeList.push(element);
        }
      }
      resolve(treeList);
    });
  }

  // 获取字典
  async getDepartmentChildren(parent_id) {
    return new Promise(async (resolve) => {
      let  res= await Dict.findAll({
        where: {
          parent_id: parent_id,
        },
        raw: true,
      });
      let list = [...res];
      let treeList = [];
      if (list.length > 0) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          element.children = await this.getDepartmentChildren(element.id);
          treeList.push(element);
        }
      }
      resolve(treeList);
    });
  }

  // 查询部门-详情
  async getDept(params) {
    return sequelize.transaction(async (t) => {
      return await Dict.findOne({
        where: {
          id: params.id,
        },
      });
    });
  }
}

module.exports = { DictService };
