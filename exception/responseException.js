class ResponseException {
  constructor(ctx, next) {
    this.ctx = ctx;
    this.next = next;
  }
  async successException(data) {
    this.ctx.body = {
      errorCode: 0,
      data: data,
      message: "操作成功",
      request: `${this.ctx.method} ${this.ctx.path}`,
    };
    this.ctx.status = 200;
    console.log(this.ctx.body);
  }
}
module.exports = {
  ResponseException,
};
