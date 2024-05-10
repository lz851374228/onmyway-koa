const { Sequelize } = require("sequelize");
const { MysqlHost, MysqlPort, MysqlUsername, MysqlPassword, MysqlDatabase } =
  process.env;
const sequelize = new Sequelize(MysqlDatabase, MysqlUsername, MysqlPassword, {
  host: MysqlHost,
  port: MysqlPort,
  dialect: "mysql",
  logging: true,
  timezone: "+08:00",
  define: {
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    underscored: true,
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
sequelize.sync({
  force: false,
});
module.exports = { sequelize: sequelize };
