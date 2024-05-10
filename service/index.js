const _ = require("lodash");
const { ParametersException } = require("../exception/httpException");

class Service {
  constructor() {}

  // 组装参数
  async getObject(params, whereArray) {
    let obj = {};
    return new Promise((resolve) => {
      _.forIn(params, (value, key) => {
        whereArray.forEach((item) => {
          if (typeof item === "string" && key == item) {
            _.set(obj, key, value);
          }
          if (typeof item === "object" && key == item.key) {
            _.set(obj, key, item.getValue(value));
          }
        });
      });
      resolve(obj);
    });
  }

  // 获取page
  async getPage(params) {
    let pageSize = 20;
    let page = 1;
    try {
      if (
        params.hasOwnProperty("pageSize") &&
        _.parseInt(params.pageSize) > 0
      ) {
        pageSize = _.parseInt(params.pageSize);
      }
      if (params.hasOwnProperty("page") && _.parseInt(params.page) >= 1) {
        page = _.parseInt(params.page);
      }
    } catch (error) {
      throw new ParametersException("分页参数错误，请检查数据格式");
    }
    return {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };
  }
}

module.exports = { Service };
