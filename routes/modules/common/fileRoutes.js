const router = require("koa-router")();
const { Auth } = require("../../../middlewares/auth");
const {
  upload,
  download,
  preview,
  templateWord,
  instanceWord,
  getList
} = require("../../../controller/common/fileController");

router.prefix("/basic-api/file");

// 文件上传
router.post("/upload", upload);

// 文件下载
router.get("/download", download);

// 文件下载
router.get("/preview", preview);

// 文件列表
router.get("/getList", getList);

// 生成word-通过模板方式
router.post("/templateWord", templateWord);

// 生成word-通过实例方式
router.post("/instanceWord", instanceWord);



module.exports = router;
