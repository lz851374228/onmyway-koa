const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const officegen = require("officegen");
const path = require("path");
const fs = require("fs");
const send = require("koa-send");
const mime = require("mime-types");
const UUID = require("uuid");

const { FileValidator } = require("../../validator/modules/fileValidator");
const { FileService } = require("../../service/common/fileService");
const { ParametersException } = require("../../exception/httpException");
const { ResponseException } = require("../../exception/responseException");

const { fileDeal } = require("../../utils/index");

class FileController {
  // 文件上传
  async upload(ctx, next) {
    let file = ctx.request.files.file;
    const message = await new FileValidator().validatorUpload(file);
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    let fileList = await fileDeal(file);
    const files = await new FileService().create(fileList);
    await new ResponseException(ctx, next).successException(files);
  }
  // 文件列表
  async getList(ctx, next) {
    const query = ctx.request.query;
    const message = await new FileValidator().isMissingParameterValidator(
      query,
      ["page", "pageSize"]
    );
    if (message.length > 0) {
      throw new ParametersException(message);
    }
    const roles = await new FileService().getListByPage({
      ...query,
    });
    await new ResponseException(ctx, next).successException(roles);
  }
  // 文件下载
  async download(ctx, next) {
    let fileName = ctx.request.query.fileName;
    ctx.attachment(fileName); //设置名称
    await send(ctx, fileName, {
      root: path.join(__dirname, "../../public/uploads"),
    });
  }

  // 文件预览
  async preview(ctx, next) {
    let fileName = ctx.request.query.fileName;
    let filePath = path.join(__dirname, `../../public/uploads/${fileName}`); //图片地址
    let file = null;
    try {
      file = fs.readFileSync(filePath); //读取文件
    } catch (error) {
      //如果服务器不存在请求的图片，返回默认图片
      filePath = path.join(__dirname, "/images/default.png"); //默认图片地址
      file = fs.readFileSync(filePath); //读取文件
    }
    let mimeType = mime.lookup(filePath); //读取图片文件类型
    ctx.set("content-type", mimeType); //设置返回类型
    ctx.body = file; //返回图片
  }

  // 生成word-通过模板方式
  async templateWord(ctx, next) {
    // Load the docx file as binary content
    const content = fs.readFileSync(
      path.resolve(__dirname, "../../public/template/word.docx"),
      "binary"
    );

    // Unzip the content of the file
    const zip = new PizZip(content);

    // This will parse the template, and will throw an error if the template is
    // invalid, for example, if the template is "{user" (no closing tag)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render({
      first_name: "John",
      last_name: "Doe",
      phone: "0652455478",
      description: "New Website",
    });

    // Get the zip document and generate it as a nodebuffer
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(
      path.resolve(__dirname, "../../public/uploads/output.docx"),
      buf
    );
  }
  // 生成word-通过实例方式
  async instanceWord(ctx, next) {
    // Create an empty Word object:
    let docx = officegen("docx");

    // Officegen calling this function after finishing to generate the docx document:
    docx.on("finalize", function (written) {
      console.log("Finish to create a Microsoft Word document.");
    });

    // Officegen calling this function to report errors:
    docx.on("error", function (err) {
      console.log(err);
    });

    // Create a new paragraph:
    let pObj = docx.createP();

    pObj.addText("Simple");
    pObj.addText(" with color", { color: "000088" });
    pObj.addText(" and back color.", { color: "00ffff", back: "000088" });

    pObj = docx.createP();

    pObj.addText("Since ");
    pObj.addText("officegen 0.2.12", {
      back: "00ffff",
      shdType: "pct12",
      shdColor: "ff0000",
    }); // Use pattern in the background.
    pObj.addText(" you can do ");
    pObj.addText("more cool ", { highlight: true }); // Highlight!
    pObj.addText("stuff!", { highlight: "darkGreen" }); // Different highlight color.

    pObj = docx.createP();

    pObj.addText("Even add ");
    pObj.addText("external link", { link: "https://github.com" });
    pObj.addText("!");

    pObj = docx.createP();

    pObj.addText("Bold + underline", { bold: true, underline: true });

    pObj = docx.createP({ align: "center" });

    pObj.addText("Center this text", {
      border: "dotted",
      borderSize: 12,
      borderColor: "88CCFF",
    });

    pObj = docx.createP();
    pObj.options.align = "right";

    pObj.addText("Align this text to the right.");

    pObj = docx.createP();

    pObj.addText("Those two lines are in the same paragraph,");
    pObj.addLineBreak();
    pObj.addText("but they are separated by a line break.");

    docx.putPageBreak();

    pObj = docx.createP();

    pObj.addText("Fonts face only.", { font_face: "Arial" });
    pObj.addText(" Fonts face and size.", {
      font_face: "Arial",
      font_size: 40,
    });

    docx.putPageBreak();

    pObj = docx.createP();

    // // We can even add images:
    // pObj.addImage("some-image.png");

    // Let's generate the Word document into a file:

    let out = fs.createWriteStream("example.docx");

    out.on("error", function (err) {
      console.log(err);
    });

    // Async call to generate the output file:
    docx.generate(out);
  }
}
module.exports = new FileController();
