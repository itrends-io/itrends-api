const httpStatus = require("http-status");
const {
  userService,
  tokenService,
  followService,
  conversationService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const createConversation = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await conversationService.createNewConversation(
    req.body.friendId,
    token
  );
  res.status(httpStatus.CREATED).send({
    data: data,
    message: "Conversation created",
  });
});

const getCurrentUsersConversations = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await conversationService.getCurrentUsersConversations(token);

  res
    .status(httpStatus.CREATED)
    .send({ data: data, message: "Conversation generated" });
});

module.exports = { createConversation, getCurrentUsersConversations };
