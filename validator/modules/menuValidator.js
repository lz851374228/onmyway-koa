const validator = require("validator");
const { CustomValidator } = require("../index");

class MenuValidator extends CustomValidator {
  constructor() {
    super();
  }

}
module.exports = { MenuValidator };
