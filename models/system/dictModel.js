const { sequelize } = require("../../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");

// 字典表
class Dict extends Model {}
Dict.init(
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
      comment: "字典名称",
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "字典编码",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "排序",
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
    modelName: "sys_dict",
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = {
  Dict,
};
