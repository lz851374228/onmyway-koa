class ResponseException {
  constructor(ctx, next) {
    this.ctx = ctx;
    this.next = next;
  }
  async successException(data = null) {
    this.ctx.body = {
      code: 0,
      message: "操作成功",
      result: data,
      request: `${this.ctx.method} ${this.ctx.path}`,
    };
    this.ctx.status = 200;
  }
}
module.exports = {
  ResponseException,
};
