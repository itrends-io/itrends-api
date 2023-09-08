const httpStatus = require("http-status");
const { User } = require("../../models");
const ApiError = require("../utils/ApiError");

const registerUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

module.exports = {
  registerUser,
};
