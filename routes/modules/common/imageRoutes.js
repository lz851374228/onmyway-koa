const router = require("koa-router")();
const { Auth } = require("../../../middlewares/auth");
const {
    getUrlByBase64
} = require("../../../controller/common/imageController");

router.prefix("/uniapp/image");

// 图片处理，将base64转化为url存储
router.post("/getUrlByBase64", getUrlByBase64);

module.exports = router;
