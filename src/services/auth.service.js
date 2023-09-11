const httpStatus = require("http-status");
const { User, Token } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { tokenService } = require("./token.service");
const { userService } = require("./user.service");

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
  try {
    const tokenDoc = await Token.findOne({
      where: {
        token: resetPasswordToken,
        type: tokenTypes.RESET_PASSWORD,
      },
    });

    if (!tokenDoc) {
      console.error("Token not found or error occurred during retrieval");
      throw new Error("Invalid or expired reset password token");
    }

    const user = await userService.getUserById(tokenDoc.userId);
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
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

const refreshAuthToken = async (refreshToken) => {
  try {
    const refreshTokenDoc = await Token.findOne({
      where: {
        token: refreshToken,
        type: tokenTypes.REFRESH,
      },
    });
    if (!refreshTokenDoc) {
      throw new Error("Invalid or expired refresh token");
    }
    const user = await userService.getUserById(refreshTokenDoc.userId);
    if (!user) {
      throw new Error("User not found");
    }
    await refreshTokenDoc.destroy();
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

const emailVerification = async (emailVerificationToken) => {
  try {
    const emailVerificationTokenDoc = await Token.findOne({
      where: {
        token: emailVerificationToken,
        type: tokenTypes.EMAIL_VERIFICATION,
      },
    });

    if (!emailVerificationTokenDoc) {
      throw new Error("Invalid or expired email verification token");
    }
    const user = await userService.getUserById(
      emailVerificationTokenDoc.userId
    );

    if (!user) {
      throw new Error("User not found");
    }

    await Token.destroy({
      where: {
        userId: user.id,
        type: tokenTypes.EMAIL_VERIFICATION,
      },
    });

    user.isEmailVerified = true;
    await user.save();

    return user;
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
};
