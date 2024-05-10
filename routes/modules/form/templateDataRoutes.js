const router = require("koa-router")();
const { Auth } = require("../../../middlewares/auth");
const {
  create,
  del,
  update,
  getList,
  getTemplateData,
} = require("../../../controller/form/templateDataController");

router.prefix("/basic-api/form/templateData");

// 新增
router.post("/create", new Auth().auth, create);

// 修改
router.post("/update", new Auth().auth, update);

// 查询-详情
router.get("/read", new Auth().auth, getTemplateData);

// 删除
router.get("/del", new Auth().auth, del);

// 查询-列表
router.post("/getList", new Auth().auth, getList);

module.exports = router;
