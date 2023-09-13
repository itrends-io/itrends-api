const Joi = require("joi");
const { objectId, password, tokenRegex } = require("./custom.validations");

const getOneUserByPk = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

module.exports = {
  getOneUserByPk,
};
