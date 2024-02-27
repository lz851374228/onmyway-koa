const router = require("koa-router")();
const { create } = require("../../controller/integralController");

router.prefix("/integral");

// 新增积分
router.post("/create", create);

module.exports = router;
