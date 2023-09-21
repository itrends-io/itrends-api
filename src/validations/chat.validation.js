const Joi = require("joi");
const { objectId, password, tokenRegex } = require("./custom.validations");

const createChat = {
  body: Joi.object().keys({
    friend_id: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

const get_current_chat = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

const create_message = {
  body: Joi.object().keys({
    chat_id: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

const get_messages = {
  body: Joi.object().keys({
    chat_id: Joi.string().required(),
  }),
};

module.exports = {
  createChat,
  get_current_chat,
  create_message,
  get_messages,
};
