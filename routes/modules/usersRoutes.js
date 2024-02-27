const router = require("koa-router")();
const {
  register,
  login,
  isUserExist,
  findOneUserByusername,
  findUsers,
  updateUser,
  deleteUser
} = require("../../controller/usersController");

router.prefix("/user");

// 用户注册
router.post("/register", register);

// 用户登录
router.post("/login", login);

// 用户是否已经存在
router.get("/isUserExist", isUserExist);

// 查询用户-通过用户名
router.get("/findOneUserByusername", findOneUserByusername);

// 查询用户
router.post("/findUsers", findUsers);

// 修改用户
router.post("/updateUser", updateUser);

// 删除用户
router.post("/deleteUser", deleteUser);



module.exports = router;
