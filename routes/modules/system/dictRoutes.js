const router = require("koa-router")();
const { Auth } = require("../../../middlewares/auth");
const {
  create,
  del,
  update,
  findAll,
  getDictList,
  getDict,
} = require("../../../controller/system/dictController");

router.prefix("/basic-api/system/dict");

// 新增部门
router.post("/create", new Auth().auth, create);

// 修改部门
router.post("/update", new Auth().auth, update);

// 查询部门-详情
router.get("/read", new Auth().auth, getDict);

// 删除部门
router.get("/del", new Auth().auth, del);

// 查询部门-树形结构
router.post("/getList", new Auth().auth, getDictList);

// 查询部门
router.post("/findAll", new Auth().auth, findAll);

module.exports = router;
