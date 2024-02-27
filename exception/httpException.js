class HttpException extends Error {
  constructor(errorCode, message, stauts) {
    super()
    this.errorCode = errorCode;
    this.message = message;
    this.stauts = stauts;
  }
}
class ParametersException extends HttpException {
  constructor(message) {
    super()
    this.errorCode = 10000;
    this.stauts = 400;
    this.message = message;
  }
}

module.exports = {
  HttpException,
  ParametersException,
};
