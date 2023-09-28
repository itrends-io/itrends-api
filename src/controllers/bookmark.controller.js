const httpStatus = require("http-status");
const { userService, tokenService, bookmarkService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const pick = require("../utils/pick");

const add_post_to_bookmark = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await bookmarkService.add_post_to_bookmark(token, req.body);
  res.status(httpStatus.ACCEPTED).send({ data: data, message: "Post saved" });
});

const get_all_bookmarked = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const filter = pick(req.query, ["type"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const data = await bookmarkService.get_all_bookmarked(
    token,
    req.body,
    filter,
    options
  );
  res.status(httpStatus.CREATED).send({
    data: data,
    message: "",
  });
});

module.exports = {
  add_post_to_bookmark,
  get_all_bookmarked,
};
