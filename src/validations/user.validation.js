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
const getUserByQuery = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

const followUserByPk = {
  body: Joi.object().keys({
    following_id: Joi.string().required(),
  }),
};

const unFollowUserByPk = {
  body: Joi.object().keys({
    un_follow_id: Joi.string().required(),
  }),
};

module.exports = {
  getOneUserByPk,
  followUserByPk,
  unFollowUserByPk,
  getUserByQuery,
};
