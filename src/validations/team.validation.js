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

const get_team_by_id = {
  body: Joi.object().keys({
    team_id: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

const create_team_invitation = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().required(),
  }),
  params: Joi.object().keys({
    team_id: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
};

module.exports = { create_team, get_team_by_id, create_team_invitation };
