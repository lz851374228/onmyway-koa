const { Op } = require("sequelize");
const { Users } = require("../models/usersModel");
class UserService {
  constructor() {}
  //查询用户-通过用户名
  async findOneUser(username) {
    return new Promise(async (resolve) => {
      let res = await Users.findOne({
        where: {
          username: username,
        },
      });
      resolve(res);
    });
  }
  // 查询用户
  async findUsers(params) {
    return await Users.findAll({
      where: {
        // username:params.username
      },
    });
  }
  //新增用户
  async createUser(user) {
    return await Users.findOrCreate({
      where: {
        username: user.username,
      },
      defaults: user,
    });
  }
  // 修改用户
  async updateUser(user) {
    return await Users.update(
      {
        nickname:user.nickname
      },
      {
        where: {
          username: {
            [Op.substring]:user.username
          },
        },
      }
    );
  }
  // 删除用户
  async deleteUser(user){
    return await Users.destroy({
      where:{
        phone:user.phone
      }
    })
  }
}

module.exports = { UserService };
