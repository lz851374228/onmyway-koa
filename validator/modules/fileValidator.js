const validator = require("validator");
const bcrypt = require("bcryptjs");
const { CustomValidator } = require("../index");

class FileValidator extends CustomValidator {
  constructor() {
    super();
  }
  // 文件上传
  async validatorUpload(file) {
    if(!file){
        this.message.push('请选择文件上传')
    }
    return this.message;
  }
}
module.exports = { FileValidator };
