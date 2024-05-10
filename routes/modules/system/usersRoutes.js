const router = require("koa-router")();
const { Auth } = require("../../../middlewares/auth");
const {
  create,
  update,
  read,
  del,
  listByPage,
  register,
  login,
  getUserInfo,
  getPermCode,
  userExist,
} = require("../../../controller/system/usersController");

router.prefix("/basic-api/system/user");

// 新增用户
router.post("/create", new Auth().auth, create);

// 修改用户
router.post("/update", new Auth().auth, update);

// 查询用户-详情
router.get("/read", new Auth().auth, read);

// 删除用户
router.get("/del", new Auth().auth, del);

// 查询用户-列表
router.get("/list", new Auth().auth, listByPage);

// 注册
router.post("/register", register);

// 登录
router.post("/login", login);

// 获取用户信息
router.get("/getUserInfo", new Auth().auth, getUserInfo);

// 获取权限码
router.get("/getPermCode", new Auth().auth, getPermCode);

// 验证用户是否存在
router.post("/userExist", new Auth().auth, userExist);

module.exports = router;
