const { sequelize } = require("../../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");
const { Users } = require("./usersModel");

// 部门表
class Department extends Model {}
Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "父ID",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "部门名称",
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "部门类型：1公司，2部门",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "排序",
    },
    ancestors: {
      type: DataTypes.STRING,
      comment: "部门层级",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
      comment: "状态：0启用，1停用",
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
    modelName: "sys_department",
    paranoid: true,
    freezeTableName: true,
  }
);

// 部门-用户表
class DepartmentUser extends Model {}
DepartmentUser.init(
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
    modelName: "sys_department_user",
    paranoid: true,
    freezeTableName: true,
  }
);
Users.belongsToMany(Department, {
  through: DepartmentUser,
  foreignKey: "sys_user_id",
  otherKey: "sys_department_id",
});
Department.belongsToMany(Users, {
  through: DepartmentUser,
  foreignKey: "sys_department_id",
  otherKey: "sys_user_id",
});
Users.hasMany(DepartmentUser);
DepartmentUser.belongsTo(Users);
Department.hasMany(DepartmentUser);
DepartmentUser.belongsTo(Department);

module.exports = {
  Department,
  DepartmentUser,
};
