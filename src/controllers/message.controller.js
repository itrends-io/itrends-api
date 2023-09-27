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
const pick = require("../utils/pick");

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
  const filter = pick(req.query, ["read_status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
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

const unlike_message = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await messageService.unlike_message(
    token,
    req.body.user_id,
    req.body.message_id
  );

  res.status(httpStatus.CREATED).send({ data: "unliked", message: "success" });
});

const reply_to_message = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await messageService.reply_to_message(token, req.body);

  res.status(httpStatus.CREATED).send({ data: data, message: "" });
});

const pin_message = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await messageService.pin_message(token, req.body);

  res.status(httpStatus.CREATED).send({ message: "pinned" });
});

const unpin_message = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await messageService.unpin_message(token, req.body);

  res.status(httpStatus.CREATED).send({ message: "unpinned" });
});

module.exports = {
  create_message,
  get_messages,
  update_chat_read_status,
  like_message,
  unlike_message,
  reply_to_message,
  pin_message,
  unpin_message,
};
