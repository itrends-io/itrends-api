const httpStatus = require("http-status");
const { authService, tokenService, emailService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const registerUser = catchAsync(async (req, res) => {
  console.log(req.body);
  const user = await authService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const message = "Successfully registered";
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
    .send({
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token: tokens.access,
      message,
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

const logoutUser = catchAsync(async (req, res) => {
  await authService.logoutUser(req.cookies.refreshToken);
  res.status(httpStatus.NO_CONTENT).send("Successfully logged out");
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
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
    .send({ user, token: tokens.access });
});

const emailVerification = catchAsync(async (req, res) => {
  const user = await authService.emailVerification(req.query.token);
  res.send({ isEmailVerified: !!user.isEmailVerified });
});

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
  logoutUser,
  resetPassword,
  refreshTokens,
  emailVerification,
};
