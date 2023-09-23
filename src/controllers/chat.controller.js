const httpStatus = require("http-status");
const {
  userService,
  tokenService,
  followService,
  chatService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const createChat = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await chatService.createNewChat(req.body.friend_id, token);
  res.status(httpStatus.CREATED).send({
    data: data,
    message: "Chat created",
  });
});

const getCurrentUsersChat = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await chatService.getCurrentUsersChats(token);

  res
    .status(httpStatus.CREATED)
    .send({ data: data, message: "Chat generated" });
});

module.exports = { createChat, getCurrentUsersChat };
