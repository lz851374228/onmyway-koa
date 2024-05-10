
const jwt = require("jsonwebtoken");
const { TimeoutException } = require("../exception/httpException");

const screctKey = "asdfghjklqwertyui123456789";
const whitelist = [];

// 验证用户身份
class Auth {
  constructor() {}
  async setToken(payload) {
    let token = jwt.sign(
      {
        ...payload,
      },
      screctKey,
      { expiresIn: 60 * 60 }
    );
    return token;
  }
  async auth(ctx, next) {
    const token = ctx.request.header.authorization;
    let tokenPayload = null;
    if (token) {
      try {
        tokenPayload = jwt.verify(token, screctKey);
      } catch (error) {
        throw new TimeoutException(`登录过期，请重新登录！${error}`);
      }
      ctx.request.tokenPayload = tokenPayload;
      await next();
    } else {
      throw new TimeoutException("用户未登录，请登录！");
    }
  }
}
module.exports = { Auth };
