const Joi = require("joi");
const { objectId, password } = require("./custom.validations");

const register = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({}),
  cookies: Joi.object()
    .keys({
      refreshToken: Joi.string().required(),
    })
    .unknown(true),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const emailVerification = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({}),
};

module.exports = {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
  emailVerification,
};