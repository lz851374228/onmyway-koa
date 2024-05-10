const { sequelize } = require("../../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");

// 表单模板表
class Template extends Model {}
Template.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "模板名称",
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "模板类型id",
    },
    schemas: {
      type: DataTypes.TEXT,
      comment: "表单配置",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0",
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
    modelName: "form_template",
    paranoid: true,
    freezeTableName: true,
  }
);

// 表单模板数据表
class TemplateData extends Model {}
TemplateData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    form_template_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "模板id",
    },
    form_data: {
      type: DataTypes.TEXT,
      comment: "模板数据",
    },
    addition: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "额外信息",
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
    modelName: "form_template_data",
    paranoid: true,
    freezeTableName: true,
  }
);
Template.hasMany(TemplateData,{
  foreignKey:'form_template_id'
});
TemplateData.belongsTo(Template);

module.exports = {
  Template,
  TemplateData
};
