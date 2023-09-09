const Joi = require("joi");
const { objectId, password } = require("./custom.validations");

const registerUser = {
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

module.exports = {
  registerUser,
  login,
  logout,
};
