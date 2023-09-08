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

module.exports = {
  registerUser,
};
