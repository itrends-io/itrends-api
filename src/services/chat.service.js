const httpStatus = require("http-status");
const { User, Chat, Message, Token, sequelize } = require("../../models");
const { DataTypes, Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");

User.belongsToMany(User, {
  through: Chat,
  as: "SenderChats",
  foreignKey: "chat_sender_id",
  type: DataTypes.UUID,
});

User.belongsToMany(User, {
  through: Chat,
  as: "ReceiverChats",
  foreignKey: "chat_receiver_id",
  type: DataTypes.UUID,
});

Chat.hasMany(Message, {
  foreignKey: "chat_id",
  as: "chat",
  type: DataTypes.UUID,
});

Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
  type: DataTypes.UUID,
});

User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages",
  type: DataTypes.UUID,
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
  if (!user_data) {
    throw new Error("User not found");
  }
  const friend_data = await User.findByPk(friend_id);
  if (!friend_data) {
    throw new Error("Friend not found");
  }

  const existingChat = await Chat.findOne({
    where: {
      [Op.or]: [
        {
          chat_sender_id: user_data.user_id,
          chat_receiver_id: friend_data.user_id,
        },
        {
          chat_sender_id: friend_data.user_id,
          chat_receiver_id: user_data.user_id,
        },
      ],
    },
  });

  if (existingChat) {
    return existingChat;
  }

  if (friend_data.id === user_data.user_id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot create a chat with yourself"
    );
  }

  const chat_data = await Chat.create({
    chat_sender_id: user_data.user_id,
    chat_receiver_id: friend_data.user_id,
  });

  return chat_data;
};

const getCurrentUsersChats = async (access_token) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const chats = await Chat.findAll({
    where: {
      [Op.or]: [
        { chat_sender_id: get_user_token_doc.userId },
        { chat_receiver_id: get_user_token_doc.userId },
      ],
    },
    include: [
      {
        model: Message,
        as: "chat",
        include: [
          {
            model: User,
            as: "sender",
          },
        ],
      },
    ],
  });

  return chats;
};

module.exports = {
  createNewChat,
  getCurrentUsersChats,
};
