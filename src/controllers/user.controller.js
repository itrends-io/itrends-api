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

const followUser = catchAsync(async (req, res) => {
  const data = await userService.followUser(
    req.params.userId,
    req.headers.authorization,
    req.body.followingId
  );
  res
    .status(httpStatus.ACCEPTED)
    .send({ data: data, message: "you are now following" });
});

const unFollowUser = catchAsync(async (req, res) => {
  const data = await userService.followUser(
    req.params.userId,
    req.headers.authorization,
    req.body.unFollowId
  );
  res.status(httpStatus.ACCEPTED).send({ data: data, message: "success" });
});

module.exports = {
  getUserByPk,
  followUser,
  unFollowUser,
};
