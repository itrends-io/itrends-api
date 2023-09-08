const httpStatus = require("http-status");
const { userService, tokenService, emailService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const registerUser = catchAsync(async (req, res) => {
  const user = await userService.registerUser(req.body);
  console.log(user);
  const tokens = await tokenService.generateAuthTokens(user);
  const emailVerificationToken =
    await tokenService.generateEmailVerificationToken(user);

  try {
    await emailService.sendEmailVerificationEmail(
      email,
      emailVerificationToken
    );
  } catch (error) {
    logger.warn(
      "Unable to send verification email. Make sure that the email server is connected"
    );
  }

  res
    .cookie("refreshToken", tokens.refresh.token, {
      maxAge: tokens.refresh.maxAge,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(httpStatus.CREATED)
    .send({ user, token: tokens.access });
});

module.exports = {
  registerUser,
};
