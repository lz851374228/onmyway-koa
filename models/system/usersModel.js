const { sequelize } = require("../../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");

// 用户表
class Users extends Model {}
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      comment: "用户名",
      validate: {
        is: {
          args: ["^[a-zA-Z0-9]{4,16}$", "i"],
          msg: "用户名不符合规范，需要4到16位字母或数字",
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "密码",
      set(val) {
        const slat = bcrypt.genSaltSync(10);
        const psw = bcrypt.hashSync(val, slat);
        this.setDataValue("password", psw);
      },
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      comment: "手机号",
      validate: {
        is: {
          args: ["^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$", "i"],
          msg: "手机格式不正确",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      comment: "邮箱",
      validate: {
        isEmail: true,
      },
    },
    nickname: {
      type: DataTypes.STRING(255),
      comment: "昵称",
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "性别：0女，1男，2未知",
      defaultValue: 2,
    },
    avatar: {
      type: DataTypes.STRING(255),
      comment: "用户头像地址",
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "账号状态：0正常，1停用",
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
      comment: "修改人"
    },
  },
  {
    sequelize: sequelize,
    modelName: "sys_user",
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = {
  Users,
};
