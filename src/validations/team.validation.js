const Joi = require("joi");
const { objectId, password, tokenRegex } = require("./custom.validations");

const create_team = {
  body: Joi.object().keys({
    team_name: Joi.string().required(),
    type: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

module.exports = { create_team };
