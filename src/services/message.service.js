const httpStatus = require("http-status");
const {
  User,
  Conversation,
  Follower,
  Message,
  Token,
} = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { getUserById } = require("./user.service");

const create_message = async (access_token, message_body) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  // const user_data = await User.findByPk(get_user_token_doc.userId);

  const message = await Message.create({
    conversationId: message_body.conversation_id,
    message: message_body.message,
    senderId: get_user_token_doc.userId,
  });

  return message;
};

module.exports = { create_message };
