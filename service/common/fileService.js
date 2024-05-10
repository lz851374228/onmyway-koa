const { Op } = require("sequelize");
const { Service } = require("../index");
const { FileRecord } = require("../../models/common/fileModel");
const { sequelize } = require("../../utils/db-mysql");
const { ParametersException } = require("../../exception/httpException");

class FileService extends Service {
  constructor() {
    super();
  }
  // 新增
  async create(fileList) {
    return await sequelize.transaction(async (t) => {
      return await FileRecord.bulkCreate([
        ...fileList
      ]);
    });
  }
  // 列表
  async getListByPage(params){
    return sequelize.transaction(async (t) => {
      let whereObject = await this.getObject(params, [
        "id",
        "uuid",
        "name",
        "type",
      ]);
      let pageObject = await this.getPage(params);
      return await FileRecord.findAll({
        where: whereObject,
        ...pageObject,
      });
    });
  }
  // 修改角色
  async updateRole(params) {
    return sequelize.transaction(async (t) => {
      let valueObject = await this.getObject(params, [
        "name",
        "code",
        "data_scope",
        "order",
        "status",
        "remark",
        "create_by",
      ]);
      await Role.update(
        {
          ...valueObject,
        },
        {
          where: {
            id: params.id,
          },
          transaction: t,
        }
      );
      await RoleMenu.destroy({
        where: {
          sys_role_id: params.id,
        },
        force: true,
        transaction: t,
      });
      if (params.sys_role_menus && params.sys_role_menus.length > 0) {
        let roleMenuList = params.sys_role_menus.map((item) => {
          return {
            sys_menu_id: item.sys_menu_id,
            sys_role_id: params.id,
          };
        });
        await RoleMenu.bulkCreate(roleMenuList, { transaction: t });
      }
    });
  }
  // 删除角色
  async deleteRole(id) {
    return sequelize.transaction(async (t) => {
      await RoleUser.destroy({
        where: {
          sys_role_id: id,
        },
        force: true,
        transaction: t,
      });
      await RoleMenu.destroy({
        where: {
          sys_role_id: id,
        },
        force: true,
        transaction: t,
      });
      await Role.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });
    });
  }
  // 设置角色状态
  async setRoleStatus(params) {
    return sequelize.transaction(async (t) => {
      return await Role.update(
        {
          status: params.status,
        },
        {
          where: {
            id: params.id,
          },
          transaction: t,
        }
      );
    });
  }
  // 查询角色-列表
  async getRoleListByPage(params) {
    return sequelize.transaction(async (t) => {
      let whereObject = await this.getObject(params, [
        "name",
        "code",
        "status",
      ]);
      let pageObject = await this.getPage(params);
      return await Role.findAll({
        where: whereObject,
        ...pageObject,
        order:[
          ['order', 'ASC'],
        ]
      });
    });
  }
  // 查询角色-编码
  async findOneRoleByCode(code) {
    return await Role.findOne({
      where: {
        code,
      },
    });
  }
  // 查询角色-详情
  async getRoleDetails(id) {
    return sequelize.transaction(async (t) => {
      return await Role.findOne({
        where: {
          id: id,
        },
        include: [
          {
            attributes: ["sys_menu_id"],
            model: RoleMenu,
          },
        ],
        transaction: t,
      });
    });
  }
  // 查询角色-获取指定用户对应角色清单
  async getRolesByUserId(user_id) {
    let roleUsers = await RoleUser.findAll({
      where: {
        sys_user_id: user_id,
      },
      include: [
        {
          model: Role,
          where: {
            status: 0,
          },
        },
      ],
    });
    let roles = [];
    roleUsers.forEach((item) => {
      let roleUser = item.toJSON();
      roles.push(roleUser.sys_role);
    });
    return roles;
  }
  // 查询角色-全部
  async findAll(params) {
    return sequelize.transaction(async (t) => {
      const whereObject = await this.getObject(params, ["name"]);
      return await Role.findAll({
        where: whereObject,
      });
    });
  }
}

module.exports = { FileService };
