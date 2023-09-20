const httpStatus = require("http-status");
const { User, Chat, Follower, Message, Token } = require("../../models");
const { DataTypes } = require("sequelize");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { getUserById } = require("./user.service");

Chat.hasMany(Message, {
  foreignKey: "message_id",
  as: "message",
  primaryKey: true,
  unique: true,
  defaultValue: DataTypes.UUIDV4,
});

const createNewChat = async (friend_id, accessToken) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: accessToken,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const user_data = await User.findByPk(get_user_token_doc.userId);
  const friend_data = await User.findByPk(friend_id);
  if (!friend_data) {
    throw new Error("User not found");
  }

  const is_already_conversing = await Chat.findOne({
    where: {
      sender_id: user_data.user_id,
      receiver_id: friend_data.user_id,
    },
  });

  if (is_already_conversing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already have a chat this user");
  }

  if (friend_data.id === user_data.user_id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot create a chat with yourself"
    );
  }
  const chat_data = await Chat.create({
    sender_id: get_user_token_doc.userId,
    receiver_id: friend_data.user_id,
  });

  const selected_user_data = {
    user_id: user_data.user_id,
    name: user_data.name,
    email: user_data.email,
    username: user_data.username,
  };
  const selected_friend_data = {
    friend_id: friend_data.user_id,
    name: friend_data.name,
    email: friend_data.email,
    username: friend_data.username,
  };

  const selected_chat_data = {
    chat_id: chat_data.chat_id,
    created_at: chat_data.createdAt,
    updated_at: chat_data.updatedAt,
  };

  return {
    selected_user_data,
    selected_friend_data,
    selected_chat_data,
  };
};

const getCurrentUserschats = async (access_token) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }
  const chat_data = await Chat.findAll({
    where: {
      senderId: get_user_token_doc.userId,
    },
  });

  if (!chat_data) {
    throw new Error("Not data found");
  }

  const selected_chats = [];

  for (const chat of chat_data) {
    const friend_data = await User.findByPk(chat.receiverId);
    const user_data = await User.findByPk(chat.senderId);

    if (!friend_data || !user_data) {
      throw new Error("Users not found");
      continue;
    }

    const selected_user_data = {
      id: user_data.id,
      name: user_data.name,
      email: user_data.email,
      username: user_data.username,
    };
    const selected_friend_data = {
      id: friend_data.id,
      name: friend_data.name,
      email: friend_data.email,
      username: friend_data.username,
    };

    const selected_chat_data = {
      chat_id: chat.id,
      created_at: chat.createdAt,
      updated_at: chat.updatedAt,
    };

    selected_chats.push({
      selected_user_data,
      selected_friend_data,
      selected_chat_data,
    });
  }

  return selected_chats;
};

module.exports = { createNewChat, getCurrentUserschats };
