const httpStatus = require("http-status");
const { userService, tokenService, bookmarkService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const add_post_to_bookmark = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await bookmarkService.add_post_to_bookmark(token, req.body);
  res.status(httpStatus.ACCEPTED).send({ data: data, message: "Post saved" });
});

module.exports = {
  add_post_to_bookmark,
};
