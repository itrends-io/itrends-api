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

const followUserByPk = {
  body: Joi.object().keys({
    followingId: Joi.string().required(),
  }),
};

const unFollowUserByPk = {
  body: Joi.object().keys({
    unFollowId: Joi.string().required(),
  }),
};

module.exports = {
  getOneUserByPk,
  followUserByPk,
  unFollowUserByPk,
};
