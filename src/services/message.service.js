const httpStatus = require("http-status");
const {
  Message,
  Token,
  User,
  Chat,
  MessageInteraction,
} = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { DataTypes, Op } = require("sequelize");
const { messageAssociation } = require("../associations/message.association");

messageAssociation(User, MessageInteraction, Message);

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
    content: message_body.message,
    sender_id: get_user_token_doc.userId,
  });
  const chat = await Chat.findByPk(message_body.chat_id);
  if (!chat) {
    throw new Error("Chat not found");
  }
  chat.last_message_id = message.message_id;
  await chat.save();

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
    include: [
      {
        model: User,
        as: "sender",
      },
      {
        model: MessageInteraction,
        as: "interactions",
      },
    ],
  });
  return messages;
};

const update_chat_read_status = async (access_token, message_id, is_read) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });

  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const message = await Message.findOne({
    where: {
      message_id: message_id,
      sender_id: { [Op.ne]: get_user_token_doc.userId },
    },
  });
  if (!message) {
    throw new Error("Message not found");
  }
  message.read_status = is_read;
  return await message.save();
};

const like_message = async (access_token, user_interacting_id, message_id) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });

  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const user = await User.findByPk(user_interacting_id);

  if (!user) {
    throw new Error("User not found");
  }

  const message = await Message.findByPk(message_id);
  if (!message) {
    throw new Error("Message not found");
  }

  const existing_like_interaction = await MessageInteraction.findOne({
    where: {
      message_id: message_id,
      user_id: user.user_id,
      type: "like",
    },
  });

  if (existing_like_interaction) {
    throw new Error("You have already liked this message");
  }

  const status = await MessageInteraction.create({
    message_id: message_id,
    user_id: user.user_id,
    type: "like",
  });

  return status;
};

const reply_to_message = async (access_token, message_body) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });

  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const parent_message = await Message.findByPk(message_body.parent_message_id);

  if (!parent_message) {
    throw new Error("Parent message not found");
  }
  const replyMessage = await Message.create({
    chat_id: message_body.chat_id,
    content: message_body.message,
    sender_id: get_user_token_doc.userId,
    parent_message_id: parent_message.parent_message_id,
  });

  const chat = await Chat.findByPk(parent_message.chat_id);
  if (!chat) {
    throw new Error("Chat not found");
  }
  chat.last_message_id = replyMessage.message_id;
  await chat.save();

  return replyMessage;
};

module.exports = {
  create_message,
  get_messages,
  update_chat_read_status,
  like_message,
  reply_to_message,
};
