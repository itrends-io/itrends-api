const httpStatus = require("http-status");
const { Message, Token } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");

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

  const message = await Message.create({
    chat_id: message_body.chat_id,
    message: message_body.message,
    sender_id: get_user_token_doc.userId,
  });

  return message;
};

const get_messages = async (access_token, body) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const messages = await Message.findAll({
    where: {
      chat_id: body.chat_id,
    },
  });
  return messages;
};

module.exports = { create_message, get_messages };
