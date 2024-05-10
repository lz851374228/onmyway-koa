const { sequelize } = require("../../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");
const { Users } = require("./usersModel");
const { Menu } = require("./menuModel");
const {Auth} = require("../../middlewares/auth");

// 角色表
class Role extends Model {}
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "角色名称",
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "角色编码",
    },
    data_scope: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1,
      comment:
        "数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "排序",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1',
      comment: "菜单状态（1启用 0停用）",
    },
    remark: {
      type: DataTypes.STRING(255),
      comment: "备注",
    },
    create_by: {
      type: DataTypes.STRING(255),
      comment: "创建人",
    },
    update_by: {
      type: DataTypes.STRING(255),
      comment: "修改人",
    },
  },
  {
    sequelize: sequelize,
    modelName: "sys_role",
    paranoid: true,
    freezeTableName: true,
  }
);

// 角色-用户表
class RoleUser extends Model {}
RoleUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "sys_role_user",
    paranoid: true,
    freezeTableName: true,
  }
);
Users.belongsToMany(Role, {
  through: RoleUser,
  foreignKey: "sys_user_id",
  otherKey: "sys_role_id",
});
Role.belongsToMany(Users, {
  through: RoleUser,
  foreignKey: "sys_role_id",
  otherKey: "sys_user_id",
});
Users.hasMany(RoleUser);
RoleUser.belongsTo(Users);
Role.hasMany(RoleUser);
RoleUser.belongsTo(Role);

// 角色-菜单表
class RoleMenu extends Model {}
RoleMenu.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "sys_role_menu",
    paranoid: true,
    freezeTableName: true,
  }
);
Menu.belongsToMany(Role, {
  through: RoleMenu,
  foreignKey: "sys_menu_id",
  otherKey: "sys_role_id",
});
Role.belongsToMany(Menu, {
  through: RoleMenu,
  foreignKey: "sys_role_id",
  otherKey: "sys_menu_id",
});
Role.hasMany(RoleMenu);
RoleMenu.belongsTo(Role);
Menu.hasMany(RoleMenu);
RoleMenu.belongsTo(Menu);

module.exports = {
  Role,
  RoleUser,
  RoleMenu,
};
