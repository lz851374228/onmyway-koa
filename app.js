const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
require("dotenv").config();
const initRoutes = require("./routes/index");
const { HttpException } = require("./exception/httpException");

// error handler
// onerror(app)
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpException) {
      console.log("已知错误:", error);
      ctx.body = {
        errorCode: error.errorCode,
        message: error.message,
        request: `${ctx.method} ${ctx.path}`,
      };
      ctx.status = error.stauts;
    } else {
      console.log("未知错误:", error);
    }
  }
});

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

require('./models/integralModel')

// routes
initRoutes(app);

module.exports = app;
