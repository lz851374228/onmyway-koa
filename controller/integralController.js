const { IntegralValidator } = require("../validator/modules/integralValidator");
const { IntegralService } = require("../service/integralService");
const { ParametersException } = require("../exception/httpException");
const { ResponseException } = require("../exception/responseException");

class IntegralController {
  // 新增
  async create(ctx, next) {
    const body = ctx.request.body;
    const message=await new IntegralValidator().validatorCreate(body)
    if(message.length>0){
      throw new ParametersException(message);
    }
    const integral= await new IntegralService().create({
      ...body
    })
    if (integral) {
      await new ResponseException(ctx, next).successException(integral);
    }
  }
}
module.exports = new IntegralController();
