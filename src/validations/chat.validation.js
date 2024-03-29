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

const update_chat_read_status = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  body: Joi.object().keys({
    message_id: Joi.string().required(),
    is_read: Joi.string().required(),
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
  query: Joi.object().keys({
    read_status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const like_message = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  body: Joi.object().keys({
    message_id: Joi.string().required(),
    user_id: Joi.string().required(),
    type: Joi.string().required(),
  }),
};

const unlike_message = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  body: Joi.object().keys({
    message_id: Joi.string().required(),
    user_id: Joi.string().required(),
    type: Joi.string().required(),
  }),
};

const reply_to_message = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  body: Joi.object().keys({
    chat_id: Joi.string().required(),
    message: Joi.string().required(),
    parent_message_id: Joi.string().required(),
  }),
};

const pin_message = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    message_id: Joi.string().required(),
    type: Joi.string().required(),
  }),
};

const unpin_message = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    message_id: Joi.string().required(),
    type: Joi.string().required(),
  }),
};

const hide_message = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    message_id: Joi.string().required(),
    type: Joi.string().required(),
  }),
};

module.exports = {
  createChat,
  get_current_chat,
  update_chat_read_status,
  create_message,
  get_messages,
  like_message,
  unlike_message,
  reply_to_message,
  pin_message,
  unpin_message,
  hide_message,
};
