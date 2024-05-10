const router = require("koa-router")();
const { Auth } = require("../../../middlewares/auth");
const mongoose = require("mongoose");
const mongooseDB = require("../../../utils/db-mongo");
router.prefix("/mon/test");

// 测试MongoDB
router.post("/create", async (ctx, next) => {
  var schema = new mongoose.Schema({ name: "string", size: "string" });
  var Tank = mongoose.model("Tank", schema);
  var small = new Tank({ size: "small" });
  await small.save();
  const data = await Tank.find({ size: "small" });
  console.log(1,data);
});

module.exports = router;
