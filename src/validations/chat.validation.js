const Joi = require("joi");
const { objectId, password, tokenRegex } = require("./custom.validations");

const createConversation = {
  body: Joi.object().keys({
    friendId: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

const get_current_conversation = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

module.exports = {
  createConversation,
  get_current_conversation,
};
