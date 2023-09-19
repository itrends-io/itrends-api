const httpStatus = require("http-status");
const { userService, tokenService, postService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const createPost = catchAsync(async (req, res) => {
  const data = await postService.createPost(
    req.headers.authorization,
    req.body.post
  );
  res
    .status(httpStatus.ACCEPTED)
    .send({ message: "Post successfully created", data });
});

module.exports = {
  createPost,
};
