const Koa = require("koa");
const app = new Koa();
const path = require("path");
const json = require("koa-json");
const onerror = require("koa-onerror");
const { koaBody } = require("koa-body");
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
    console.log(error);
    let code = -1;
    let message = null;
    let status = 200;
    if (error instanceof HttpException) {
      code = error.code;
      message = error.message;
    } else if (error.name == "ReferenceError") {
      message = [error.message];
    } else if (error.name == "SequelizeValidationError") {
      let errorMessage = [];
      error.errors.forEach((item) => {
        errorMessage.push(item.message);
      });
      message = errorMessage;
    } else {
      message = error;
    }
    ctx.body = {
      code: code,
      message: message,
      result: null,
      request: `${ctx.method} ${ctx.path}`,
    };
    ctx.status = status;
  }
});

// middlewares
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, `/public/uploads/`), //上传文件存储目录
      keepExtensions: true, //允许保留后缀名
      multipart: true,
    },
  })
);

// 跨域处理
// import cors  from 'koa-cors';
// app.use(cors({ // 指定一个或多个可以跨域的域名
//   origin: function (ctx) { return '*'; },
//   maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
//   credentials: true,  // 是否允许发送Cookie
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // 设置所允许的HTTP请求方法
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],  // 设置服务器支持的所有头信息字段
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] // 设置获取其他自定义字段
// }))

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

// routes
initRoutes(app);

module.exports = app;
