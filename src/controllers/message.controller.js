const httpStatus = require("http-status");
const {
  userService,
  tokenService,
  followService,
  messageService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const create_message = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await messageService.create_message(token, req.body);
  res.status(httpStatus.CREATED).send({
    data: data,
    message: "Message sent",
  });
});

const get_messages = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await messageService.get_messages(token, req.body);
  res.status(httpStatus.CREATED).send({
    data: data,
    message: "Message sent",
  });
});

module.exports = { create_message, get_messages };
