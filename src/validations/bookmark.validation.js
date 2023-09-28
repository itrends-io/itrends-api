const Joi = require("joi");
const { objectId, password, tokenRegex } = require("./custom.validations");

const add_post_to_bookmark = {
  body: Joi.object().keys({
    post_id: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

const get_all_bookmarked = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  query: Joi.object().keys({
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const remove_post_from_bookmark = {
  body: Joi.object().keys({
    post_id: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

module.exports = {
  add_post_to_bookmark,
  get_all_bookmarked,
  remove_post_from_bookmark,
};
