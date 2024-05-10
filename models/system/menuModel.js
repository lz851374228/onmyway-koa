const { sequelize } = require("../../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");

// 菜单表
class Menu extends Model {}
Menu.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "父ID",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "菜单名称",
    },
    type: {
      type: DataTypes.STRING,
      comment: "类型：0目录，1菜单，2按钮",
    },
    order: {
      type: DataTypes.INTEGER,
      comment: "排序",
    },
    path: {
      type: DataTypes.STRING(255),
      comment: "路由地址",
    },
    component: {
      type: DataTypes.STRING(255),
      comment: "组件路径",
    },
    icon: {
      type: DataTypes.STRING,
      comment: "图标",
    },
    permission: {
      type: DataTypes.STRING,
      comment: "权限标识",
    },
    current_active_menu: {
      type: DataTypes.STRING(255),
      comment: "当前激活菜单",
    },
    is_frame: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
      comment: "是否为外链（0否 1是）",
    },
    is_cache: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
      comment: "是否缓存（0不缓存 1缓存）",
    },

    visible: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
      comment: "菜单状态（0显示 1隐藏）",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
      comment: "菜单状态（0正常 1停用）",
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
    modelName: "sys_menu",
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = {
  Menu,
};
