const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../../config/config");
const userService = require("./user.service");
const { Token, User } = require("../../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../../config/token");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    userId,
    expires,
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    where: {
      token,
      type,
      userId: payload.sub,
      blacklisted: false,
    },
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.user_id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  await saveToken(
    accessToken,
    user.user_id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshTokenMaxAge = refreshTokenExpires.diff(
    moment().add(5, "minutes")
  );
  const refreshToken = generateToken(
    user.user_id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    user.user_id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      maxAge: refreshTokenMaxAge,
    },
  };
};

const generateResetPasswordToken = async (email) => {
  const user = await User.findOne({
    where: { email: email },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.user_id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.user_id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

const generateEmailVerificationToken = async (user) => {
  const expires = moment().add(
    config.jwt.emailVerificationExpirationDays,
    "days"
  );
  const emailVerificationToken = generateToken(
    user.user_id,
    expires,
    tokenTypes.EMAIL_VERIFICATION
  );
  await saveToken(
    emailVerificationToken,
    user.user_id,
    expires,
    tokenTypes.EMAIL_VERIFICATION
  );
  return emailVerificationToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateEmailVerificationToken,
};
