const httpStatus = require("http-status");
const { User } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const registerUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

const getUserById = async (id) => {
  return User.findByPk(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({
    where: { email: email },
  });
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
};
