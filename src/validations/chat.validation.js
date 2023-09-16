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

const create_message = {
  body: Joi.object().keys({
    conversation_id: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

const get_messages = {
  body: Joi.object().keys({
    conversation_id: Joi.string().required(),
  }),
};

module.exports = {
  createConversation,
  get_current_conversation,
  create_message,
  get_messages,
};
