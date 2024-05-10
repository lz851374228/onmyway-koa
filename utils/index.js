const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const officegen = require("officegen");
const path = require("path");
const fs = require("fs");
const send = require("koa-send");
const mime = require("mime-types");
const { v4: uuidv4 } = require('uuid');

/**
 * 获取一个实例的所有方法
 * @param obj 对象实例
 * @param option 参数
 *
 * ```js
 *     let validateFuncKeys: string[] = getAllMethodNames(this, {
 *     filter: key =>
 *   /validate([A-Z])\w+/g.test(key) && typeof this[key] === "function"
 *  });
 * ```
 */
function getAllMethodNames(obj, option) {
  let methods = new Set();
  // tslint:disable-next-line:no-conditional-assignment
  while ((obj = Reflect.getPrototypeOf(obj))) {
    let keys = Reflect.ownKeys(obj);
    keys.forEach((k) => methods.add(k));
  }
  let keys = Array.from(methods.values());
  return prefixAndFilter(keys, option);
}

/**
 * 获得实例的所有字段名
 * @param obj 实例
 * @param option 参数项
 *
 * ```js
 *     let keys = getAllFieldNames(this, {
 *      filter: key => {
 *    const value = this[key];
 *    if (isArray(value)) {
 *      if (value.length === 0) {
 *      return false;
 *    }
 *    for (const it of value) {
 *       if (!(it instanceof Rule)) {
 *         throw new Error("every item must be a instance of Rule");
 *      }
 *    }
 *    return true;
 *   } else {
 *    return value instanceof Rule;
 *    }
 *   }
 *  });
 * ```
 */
function getAllFieldNames(obj, option) {
  let keys = Reflect.ownKeys(obj);
  return prefixAndFilter(keys, option);
}

function prefixAndFilter(keys, option) {
  option &&
    option.prefix &&
    (keys = keys.filter((key) => key.toString().startsWith(option.prefix)));
  option && option.filter && (keys = keys.filter(option.filter));
  return keys;
}

function fileDeal(file){
  return new Promise((resolve)=>{
    let fileList = [];
    if (Object.prototype.toString.call(file) == "[object Array]") {
      file.map((e) => {
        let data = fs.readFileSync(e.filepath);
        let suffix = e.originalFilename.substring(
          e.originalFilename.lastIndexOf(".") + 1
        );
        let name = e.originalFilename;
        let size = e.size;
        let uuid = uuidv4();
        fs.writeFileSync(
          path.join(__dirname, "../public/uploads/", e.newFilename),
          data
        );
        fileList.push({
          name,
          type:suffix,
          size,
          uuid,
          new_name: e.newFilename,
        });
      });
    }
    if (Object.prototype.toString.call(file) == "[object Object]") {
      let data = fs.readFileSync(file.filepath);
      let suffix = file.originalFilename.substring(
        file.originalFilename.lastIndexOf(".") + 1
      );
      let name = file.originalFilename;
      let size = file.size;
      let uuid = uuidv4();
      fs.writeFileSync(
        path.join(__dirname, "../public/uploads/", file.newFilename),
        data
      );
      fileList.push({
        name,
        type:suffix,
        size,
        uuid,
        new_name: file.newFilename,
      });
    }
    resolve(fileList)
  })
}


module.exports={
    getAllMethodNames,
    getAllFieldNames,
    fileDeal
}