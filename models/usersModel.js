const { mysqlDB } = require("../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");

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
    },
    password: {
      type: DataTypes.STRING(255),
      set(val) {
        const slat = bcrypt.genSaltSync(10);
        const psw = bcrypt.hashSync(val, slat);
        this.setDataValue("password", psw);
      },
    },
    phone: {
      type: DataTypes.STRING(11),
      unique: true,
    },
    nickname: DataTypes.STRING(255),
    integral: {
      type: DataTypes.STRING(20),
    },
    introduction: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize: mysqlDB,
    modelName: "users",
  }
);
module.exports = {
  Users,
};
