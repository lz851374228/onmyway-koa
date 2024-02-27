const { Op } = require("sequelize");
const { Integral } = require("../models/integralModel");
class IntegralService {
  constructor() {}
  async create(integral){
    return await Integral.create({
      ...integral
    })
  }
}

module.exports = { IntegralService };
