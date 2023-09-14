const httpStatus = require("http-status");
const { authService, tokenService, emailService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const registerUser = catchAsync(async (req, res) => {
  const username = await authService.generateUsername();
  const userbody = { ...req.body, username };
  const user = await authService.registerUser(userbody);
  const tokens = await tokenService.generateAuthTokens(user);
  const message = "Successfully registered";
  const emailVerificationToken =
    await tokenService.generateEmailVerificationToken(user);

  try {
    await emailService.sendEmailVerificationEmail(
      req.body.email,
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
    .send({
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token: tokens.access,
      message,
      user,
    });
});

const loginUserWithEmailAndPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const message = "Successfully signed in";
  res
    .cookie("refreshToken", tokens.refresh.token, {
      maxAge: tokens.refresh.maxAge,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .send({ user, token: tokens.access, message });
});

const changePassword = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const result = await authService.changePassword(req.body, token);
  res.status(httpStatus.ACCEPTED).send("Successfully changed password");
});

const logoutUser = catchAsync(async (req, res) => {
  await authService.logoutUser(req.cookies.refreshToken);
  res.status(httpStatus.NO_CONTENT).send("Successfully logged out");
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  logger.info("password reset sent");
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPasswordFromEmailToken(
    req.query.token,
    req.body.password
  );
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.refreshAuthToken(
    req.cookies.refreshToken
  );
  res
    .cookie("refreshToken", tokens.refresh.token, {
      maxAge: tokens.refresh.maxAge,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .send({ user, token: tokens.access, message: "token refreshed" });
});

const emailVerification = catchAsync(async (req, res) => {
  const user = await authService.emailVerification(req.query.token);
  console.log("this is token:", req.query.token);
  res.send({ isEmailVerified: !!user.isEmailVerified });
});

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
  logoutUser,
  forgotPassword,
  resetPassword,
  refreshTokens,
  emailVerification,
  changePassword,
};
