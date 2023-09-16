const httpStatus = require("http-status");
const { User, Conversation, Follower } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { getUserById } = require("./user.service");

const createNewConversation = async (data) => {
  const conversationData = await Conversation.create({
    senderId: data.senderId,
    receiverId: data.receiverId,
  });

  // console.log(conversationData);
  return conversationData;
};

const getCurrentUsersConversations = async (data) => {
  const conversationData = await Conversation.findAll({
    where: {
      senderId: data,
    },
  });
  return conversationData;
};

module.exports = { createNewConversation, getCurrentUsersConversations };
