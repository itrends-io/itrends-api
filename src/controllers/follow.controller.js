const httpStatus = require("http-status");
const { userService, tokenService, followService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const followUser = catchAsync(async (req, res) => {
  const data = await followService.followUser(
    req.headers.authorization,
    req.body.following_id
  );
  res.status(httpStatus.ACCEPTED).send({ data: "", message: "You followed" });
});

const unFollowUser = catchAsync(async (req, res) => {
  const data = await followService.unFollowUser(
    req.params.userId,
    req.headers.authorization,
    req.body.unFollowId
  );
  res.status(httpStatus.ACCEPTED).send({ data: "", message: "You unfollowed" });
});

module.exports = {
  followUser,
  unFollowUser,
};
