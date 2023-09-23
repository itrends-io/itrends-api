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
    message: "",
  });
});

const update_chat_read_status = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await messageService.update_chat_read_status(
    token,
    req.body.message_id,
    req.body.is_read
  );

  res.status(httpStatus.CREATED).send({ data: data, message: "" });
});

const like_message = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await messageService.like_message(
    token,
    req.body.user_id,
    req.body.message_id
  );

  res.status(httpStatus.CREATED).send({ data: data, message: "" });
});

module.exports = {
  create_message,
  get_messages,
  update_chat_read_status,
  like_message,
};
