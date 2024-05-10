const router = require("koa-router")();
const { Auth } = require("../../../middlewares/auth");
const {
  create,
  update,
  del,
  findAllTree,
  getRoutes,
  getMenuList,
} = require("../../../controller/system/menuController");

router.prefix("/basic-api/system/menu");

// 新增菜单
router.post("/create", new Auth().auth, create);

// 修改菜单
router.post("/update", new Auth().auth, update);

// 删除菜单
router.post("/del", new Auth().auth, del);

// 获取菜单列表
router.get("/getMenuList", new Auth().auth, getMenuList);

// 查询菜单-树形结构
router.post("/findAllTree", new Auth().auth, findAllTree);

// 获取路由
router.get("/getRoutes", new Auth().auth, getRoutes);

module.exports = router;
