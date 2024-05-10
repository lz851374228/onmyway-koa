const router = require("koa-router")();
const { Auth } = require("../../../middlewares/auth");
const {
  create,
  delDept,
  update,
  findAll,
  getDeptList,
  getDept,
} = require("../../../controller/system/deptController");

router.prefix("/basic-api/system/dept");

// 新增部门
router.post("/create", new Auth().auth, create);

// 修改部门
router.post("/update", new Auth().auth, update);

// 查询部门-详情
router.get("/read", new Auth().auth, getDept);

// 删除部门
router.get("/del", new Auth().auth, delDept);

// 查询部门-树形结构
router.post("/getDeptList", new Auth().auth, getDeptList);

// 查询部门
router.post("/findAll", new Auth().auth, findAll);

module.exports = router;
