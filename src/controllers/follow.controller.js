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
    req.headers.authorization,
    req.body.un_follow_id
  );
  res.status(httpStatus.ACCEPTED).send({ data: "", message: "You unfollowed" });
});

const followings_list = catchAsync(async (req, res) => {
  const data = await followService.get_all_followings_list(
    req.headers.authorization
  );
  res.status(httpStatus.ACCEPTED).send({ data: data, message: "Success" });
});
const followers_list = catchAsync(async (req, res) => {
  const data = await followService.get_all_followers_list(
    req.headers.authorization
  );
  res.status(httpStatus.ACCEPTED).send({ data: data, message: "Success" });
});

const taggedUsers = catchAsync(async (req, res) => {
  const { name } = req.query;
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const users = await followService.taggedUsers(token, name);
  res.status(httpStatus.ACCEPTED).send({ message: "success", users });
});

module.exports = {
  followUser,
  taggedUsers,
  unFollowUser,
  followings_list,
  followers_list,
};
