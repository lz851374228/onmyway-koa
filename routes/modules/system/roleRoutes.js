const router = require("koa-router")();
const {
  create,
  update,
  read,
  del,
  list,
  findAll,
  setRoleStatus,
  userExist,
} = require("../../../controller/system/roleController");
const { Auth } = require("../../../middlewares/auth");

router.prefix("/basic-api/system/role");

// 新增角色
router.post("/create", new Auth().auth, create);

// 修改角色
router.post("/update", new Auth().auth, update);

// 查询角色-详情
router.get("/read", new Auth().auth, read);

// 删除角色
router.get("/del", new Auth().auth, del);

// 查询角色-列表
router.get("/list", new Auth().auth, list);

// 查询角色-全部
router.get("/findAll", new Auth().auth, findAll);

// 设置角色状态
router.post("/setRoleStatus", new Auth().auth, setRoleStatus);

// 判断用户名是否存在
router.post("/userExist", new Auth().auth, userExist);

module.exports = router;
