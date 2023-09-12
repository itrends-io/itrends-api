const httpStatus = require("http-status");
const { User, Token } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { userService, getUserById, updateUserById } = require("./user.service");
const { tokenService, verifyToken } = require("./token");
const bcrypt = require("bcryptjs");

const registerUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({
    where: { email: email },
  });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

const changePassword = async (userBody, refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    where: {
      token: refreshToken,
      type: tokenTypes.REFRESH,
    },
  });
  if (!refreshTokenDoc) {
    throw new Error("Invalid or expired refresh token");
  }
  const user = await User.findByPk(refreshTokenDoc.userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!(await user.isPasswordMatch(userBody.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  if (userBody.new_password !== userBody.confirm_password) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "New password and confirm password must be the same"
    );
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userBody.new_password, salt);

  await updateUserById(user.id, { password: hashedPassword });
};

const logoutUser = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    where: {
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    },
  });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Refresh token not found");
  }

  await refreshTokenDoc.destroy();
  // logger.info("Successfully logged out");
};

const resetPassword = async (resetPasswordToken, newPassword) => {
  const resetPasswordTokenDoc = await verifyToken(
    resetPasswordToken,
    tokenTypes.RESET_PASSWORD
  );

  logger.info(resetPasswordTokenDoc);

  const user = await getUserById(resetPasswordTokenDoc.user);

  if (!user) {
    throw new Error("User not found");
  }
  await Token.destroy({
    where: {
      userId: user.id,
      type: tokenTypes.RESET_PASSWORD,
    },
  });
  await updateUserById(user.id, { password: newPassword });
};

const refreshAuthToken = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    where: {
      token: refreshToken,
      type: tokenTypes.REFRESH,
    },
  });
  if (!refreshTokenDoc) {
    throw new Error("Invalid or expired refresh token");
  }
  const user = await User.findByPk(refreshTokenDoc.userId);
  if (!user) {
    throw new Error("User not found");
  }
  await refreshTokenDoc.destroy();
  const tokens = await tokenService.generateAuthTokens(user);
  return { user, tokens };
};

const emailVerification = async (emailVerificationToken) => {
  try {
    const emailVerificationTokenDoc = await tokenService.verifyToken(
      emailVerificationToken,
      tokenTypes.EMAIL_VERIFICATION
    );
    const user = await userService.getUserById(emailVerificationTokenDoc.user);
    if (!user) {
      throw new Error("User not found");
    }
    await Token.destroy({
      where: {
        userId: user.id,
        type: tokenTypes.EMAIL_VERIFICATION,
      },
    });
    const updatedUser = await userService.updateUserById(user.id, {
      isEmailVerified: true,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user email verification status");
    }

    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
  logoutUser,
  resetPassword,
  refreshAuthToken,
  emailVerification,
  changePassword,
};
