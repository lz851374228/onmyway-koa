const { mysqlDB } = require("../utils/db-mysql");
const { Sequelize, DataTypes, Model } = require("sequelize");

class Integral extends Model {}

Integral.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name:{
        type:DataTypes.STRING(255),
    },
    num:{
        type:DataTypes.INTEGER({
            length:4
        })
    },
    type:{
        type:DataTypes.TINYINT({
            length:1
        })
    },
    description:{
        type:DataTypes.STRING(255)
    }
  },
  {
    sequelize: mysqlDB,
    modelName: "integral",
  }
);
module.exports = {
    Integral,
};
