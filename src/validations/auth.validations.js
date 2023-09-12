const Joi = require("joi");
const { objectId, password } = require("./custom.validations");

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().custom(password),
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

const refreshTokens = {
  body: Joi.object().keys({}),
  cookies: Joi.object()
    .keys({
      refreshToken: Joi.string().required(),
    })
    .unknown(true),
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

const changePassword = {
  body: Joi.object().keys({
    // email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
    new_password: Joi.string().required().custom(password),
    confirm_password: Joi.string().required().custom(password),
  }),
  cookies: Joi.object()
    .keys({
      refreshToken: Joi.string().required(),
    })
    .unknown(true),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  resetPassword,
  forgotPassword,
  emailVerification,
  changePassword,
};
