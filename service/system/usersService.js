const { Op } = require("sequelize");
const _ = require("lodash");
const { sequelize } = require("../../utils/db-mysql");
const { Service } = require("../index");
const { Users } = require("../../models/system/usersModel");
const { Role, RoleUser } = require("../../models/system/roleModel");
const { Department, DepartmentUser } = require("../../models/system/deptModel");
const { Menu } = require("../../models/system/menuModel");
class UserService extends Service {
  constructor() {
    super();
  }
  // 新增用户
  async create(user) {
    return await sequelize.transaction(async (t) => {
      // 创建人信息需要从token中获取
      // 如果密码为空，设置默认密码
      if (!user.password) {
        user.password = "123456";
      }
      user.create_by = true;
      let valueObject = await this.getObject(user, [
        "username",
        "password",
        "phone",
        "email",
        "nickname",
        "sex",
        "avatar",
        "status",
        "remark",
        "create_by",
        "sys_role_users",
        "sys_department_users",
      ]);

      return await Users.create(valueObject, {
        include: [
          {
            model: RoleUser,
          },
          {
            model: DepartmentUser,
          },
        ],
        transaction: t,
      });
    });
  }

  // 修改用户
  async update(params) {
    return sequelize.transaction(async (t) => {
      await RoleUser.destroy({
        where: {
          sys_user_id: params.id,
        },
        force: true,
        transaction: t,
      });
      await DepartmentUser.destroy({
        where: {
          sys_user_id: params.id,
        },
        force: true,
        transaction: t,
      });
      let valueObject = await this.getObject(params, [
        "username",
        "password",
        "phone",
        "email",
        "nickname",
        "sex",
        "avatar",
        "status",
        "remark",
        "create_by",
      ]);

      if (params.sys_role_users && params.sys_role_users.length > 0) {
        const roleUsers = [];
        params.sys_role_users.map((item) => {
          roleUsers.push({
            sys_role_id: item.sys_role_id,
            sys_user_id: params.id,
          });
        });
        RoleUser.bulkCreate(roleUsers, { transaction: t });
      }
      if (
        params.sys_department_users &&
        params.sys_department_users.length > 0
      ) {
        const departmentUsers = [];
        params.sys_department_users.map((item) => {
          departmentUsers.push({
            sys_department_id: item.sys_department_id,
            sys_user_id: params.id,
          });
        });
        DepartmentUser.bulkCreate(departmentUsers, { transaction: t });
      }
      return await Users.update(
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
    });
  }

  // 查询用户-详情
  async read(id) {
    return sequelize.transaction(async (t) => {
      return await Users.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: RoleUser,
          },
          {
            model: DepartmentUser,
          },
        ],
      });
    });
  }

  // 删除用户
  async del(id) {
    return sequelize.transaction(async (t) => {
      await RoleUser.destroy({
        where: {
          sys_user_id: id,
        },
        force: true,
        transaction: t,
      });
      await DepartmentUser.destroy({
        where: {
          sys_user_id: id,
        },
        force: true,
        transaction: t,
      });
      return await Users.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });
    });
  }

  // 查询用户-列表
  async getUserListByPage(params) {
    return sequelize.transaction(async (t) => {
      let whereObject = await this.getObject(params, ["username", "nickname"]);
      let pageObject = await this.getPage(params);
      return await Users.findAll({
        attributes: [
          "id",
          "username",
          "nickname",
          "email",
          "remark",
          "created_at",
        ],
        where: whereObject,
        ...pageObject,
        transaction: t,
      });
    });
  }

  // 获取用户信息
  async getUserInfo(id) {
    return await sequelize.transaction(async (t) => {
      const userInfo = await Users.findOne({
        attributes: ["id",'username','phone','email','nickname','avatar','remark'],
        where: {
          id: id,
          status: 0,
        },
        include: [
          {
            attributes: ["id", "name", "code"],
            model: Role,
            through: {
              attributes: [],
            },
            where: {
              status: 1,
            },
          },
          {
            model: Department,
            through: {
              attributes: [],
            },
            where: {
              status: 0,
            },
          },
        ],
      });
      let roleIds = userInfo.sys_roles.map((item) => {
        return item.id;
      });
      const roleMenus = await Role.findAll({
        where: {
          id: {
            [Op.or]: roleIds,
          },
        },
        include: [
          {
            model: Menu,
            through: {
              attributes: [],
            },
            where: {
              status: 0,
            },
          },
        ],
      });
      let menus = roleMenus.map((item) => {
        return item.sys_menus;
      });
      let flattenMenus = _.flatten(menus);
      let reduceMenus = _.uniqBy(flattenMenus, "id");
      let onk = userInfo.toJSON();
      onk.sys_menus = reduceMenus;
      return onk;
    });
  }

  // 查询用户-
  async findUsers(params) {
    return await Users.findAll({
      where: {
        // username:params.username
      },
    });
  }
  // 修改用户
  async updateUser(user) {
    return await Users.update(
      {
        nickname: user.nickname,
      },
      {
        where: {
          username: {
            [Op.substring]: user.username,
          },
        },
      }
    );
  }
  // 删除用户
  async deleteUser(user) {
    return await Users.destroy({
      where: {
        phone: user.phone,
      },
    });
  }
  // 注册
  async register(user) {
    return await sequelize.transaction(async (t) => {
      let valueObject = await this.getObject(user, [
        "username",
        "password",
        "phone",
      ]);
      return await Users.create(valueObject, {
        transaction: t,
      });
    });
  }
  // 查询用户-通过用户名
  async findOneUser(username) {
    return new Promise(async (resolve) => {
      let res = await Users.findOne({
        where: {
          username: username,
        },
      });
      resolve(res);
    });
  }
}

module.exports = { UserService };
