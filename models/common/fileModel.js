const { sequelize } = require("../../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");

// 文件记录表
class FileRecord extends Model {}
FileRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid:{
      type: DataTypes.STRING,
      allowNull: false,
      comment: "文件UUID",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "文件名称",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "文件类型",
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "文件大小",
    },
    new_name:{
        type: DataTypes.STRING(255),
      allowNull: false,
      comment: "文件名称",
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
    modelName: "common_file",
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = {
  FileRecord,
};
