const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const officegen = require("officegen");
const path = require("path");
const fs = require("fs");
const send = require("koa-send");
const mime = require("mime-types");
const { v4: uuidv4 } = require('uuid');

const { CustomValidator } = require("../../validator");
const { ParametersException } = require("../../exception/httpException");
const { ResponseException } = require("../../exception/responseException");


class FileController {
  // 图片处理，将base64转化为url存储
  async getUrlByBase64(ctx, next) {
    let body=ctx.request.body
    const message = await new CustomValidator().isMissingParameterValidator(body,['base64Data']);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    let base64Data = ctx.request.body.base64Data; // 获取前端发送的Base64数据
    let imageBuffer = Buffer.from(base64Data.replace(/^data:\w+\/\w+;base64,/, ''), 'base64'); // 去除Base64字符串的头部信息，转换为缓冲区
    let imageName = `image_${Date.now()}.png`; // 定义图片名称
    let filePath = path.join(__dirname, "../../public/uploads/",imageName); // 定义文件保存路径
    try {
      fs.writeFileSync(filePath, imageBuffer); // 将Base64数据写入文件
      await new ResponseException(ctx, next).successException(filePath);
    } catch (error) {
      throw new ParametersException(['图像保存失败'+error]);
    }
  }
}
module.exports = new FileController();
