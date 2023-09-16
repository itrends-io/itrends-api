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
  const data = await conversationService.createNewConversation(req.body);

  console.log(data);
  res
    .status(httpStatus.CREATED)
    .send({ data: "", message: "Conversation created" });
});

const getCurrentUsersConversations = catchAsync(async (req, res) => {
  const data = await conversationService.getCurrentUsersConversations(
    req.params.id
  );

  console.log(data);
  res
    .status(httpStatus.CREATED)
    .send({ data: data, message: "Conversation generated" });
});

module.exports = { createConversation, getCurrentUsersConversations };