const { Op } = require("sequelize");
const _ = require("lodash");
const { sequelize } = require("../../utils/db-mysql");
const { Service } = require("../index");
const { Department, DepartmentUser } = require("../../models/system/deptModel");
const { ParametersException } = require("../../exception/httpException");

class DeptService extends Service {
  constructor() {
    super();
  }
  // 新增部门
  async create(params) {
    return await sequelize.transaction(async (t) => {
      let valueObject = await this.getObject(params, [
        "name",
        "type",
        "order",
        "status",
        "remark",
      ]);
      const department = await Department.create(valueObject, {
        transaction: t,
      });
      if (params.parent_id) {
        const parentDepartment = await Department.findOne({
          where: {
            id: params.parent_id,
          },
        });
        if (parentDepartment == null) {
          throw new ParametersException(
            "上级部门层级不存在，无法插入当前数据！"
          );
        }
        params.ancestors = `${parentDepartment.ancestors}${department.id}>`;
      } else {
        params.ancestors = `${department.id}>`;
      }
      return await Department.update(
        {
          parent_id: params.parent_id,
          ancestors: params.ancestors,
        },
        {
          where: {
            id: department.id,
          },
          transaction: t,
        }
      );
    });
  }

  // 修改部门
  async update(params) {
    return await sequelize.transaction(async (t) => {
      if (params.parent_id) {
        const parentDepartment = await Department.findOne({
          where: {
            id: params.parent_id,
          },
        });
        if (parentDepartment == null) {
          throw new ParametersException(
            "上级部门层级不存在，无法修改当前数据！"
          );
        }
        params.ancestors = `${parentDepartment.ancestors}${params.id}>`;
      } else {
        params.ancestors = `${params.id}>`;
      }

      let valueObject = await this.getObject(params, [
        "parent_id",
        "name",
        "type",
        "order",
        "status",
        "remark",
      ]);
      return await Department.update(valueObject, {
        where: {
          id: params.id,
        },
        transaction: t,
      });
    });
  }

  // 删除部门
  async del(id) {
    return await sequelize.transaction(async (t) => {
      await DepartmentUser.destroy({
        where: {
          sys_department_id: id,
        },
        force: true,
        transaction: t,
      });
      await Department.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });
    });
  }

  // 查询部门
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
      "type",
      "ancestors",
      "status",
      "remark",
    ]);

    return await Department.findAll({
      where: whereObject,
      ...(await this.getPage(params)),
      raw: true,
    });
  }

  // 查询部门-树形结构
  async getDeptList(params) {
    return new Promise(async (resolve) => {
      if (!params.parent_id && !params.id) {
        params.parent_id = 0;
      }
      let whereObject = await this.getObject(params, [
        "id",
        "parent_id",
        "name",
      ]);
      let departments = await Department.findAll({
        where: whereObject,
        raw: true,
      });
      let list = [...departments];
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

  // 获取部门
  async getDepartmentChildren(parent_id) {
    return new Promise(async (resolve) => {
      let departments = await Department.findAll({
        where: {
          parent_id: parent_id,
        },
        raw: true,
      });
      let list = [...departments];
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
      return await Department.findOne({
        where: {
          id: params.id,
        },
      });
    });
  }
}

module.exports = { DeptService };
