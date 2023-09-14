const httpStatus = require("http-status");
const { userService, tokenService, followService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const followUser = catchAsync(async (req, res) => {
  const data = await followService.followUser(
    req.params.userId,
    req.headers.authorization,
    req.body.followingId
  );
  res
    .status(httpStatus.ACCEPTED)
    .send({ data: data, message: "you are now following" });
});

module.exports = {
  followUser,
};
