const httpStatus = require("http-status");
const { userService, tokenService, emailService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const getUserByPk = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const user = await userService.getUserById(req.params.userId, token);
  res.status(httpStatus.ACCEPTED).send({ user, message: "" });
});

module.exports = {
  getUserByPk,
};
