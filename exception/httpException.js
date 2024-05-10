class HttpException extends Error {
  constructor(code, message, stauts) {
    super()
    this.code = code;
    this.message = message;
    this.stauts = stauts;
  }
}
class ParametersException extends HttpException {
  constructor(message) {
    super()
    this.code = -1;
    this.stauts = 200;
    this.message = message;
  }
}
class TimeoutException extends HttpException {
  constructor(message) {
    super()
    this.code = 401;
    this.stauts = 200;
    this.message = message;
  }
}


class ForbidException extends HttpException {
  constructor(message) {
    super()
    this.code = 20001;
    this.stauts = 200;
    this.message = "权限不足";
  }
}


module.exports = {
  HttpException,
  ParametersException,
  TimeoutException,
  ForbidException
};
