const httpStatus = require("http-status");
const { User, Chat, Message, Token } = require("../../models");
const { DataTypes, Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");

User.belongsToMany(User, {
  through: Chat,
  as: "SenderChats",
  foreignKey: "chat_sender_id",
  type: DataTypes.UUID,
  unique: true,
});
User.belongsToMany(User, {
  through: Chat,
  as: "ReceiverChats",
  foreignKey: "chat_receiver_id",
  type: DataTypes.UUID,
  unique: true,
});

Chat.hasMany(Message, {
  foreignKey: "chat_id",
  as: "chat",
  type: DataTypes.UUID,
  unique: true,
});
Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
  type: DataTypes.UUID,
  unique: true,
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
    last_message_id: chat_data.last_message_id,
    created_at: chat_data.createdAt,
    updated_at: chat_data.updatedAt,
  };

  return {
    selected_user_data,
    selected_friend_data,
    selected_chat_data,
  };
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
  const chat_data = await Chat.findAll({
    where: {
      sender_id: get_user_token_doc.userId,
    },
  });

  if (!chat_data) {
    throw new Error("Not data found");
  }

  const selected_chats = [];

  for (const chat of chat_data) {
    const friend_data = await User.findByPk(chat.receiver_id);
    const user_data = await User.findByPk(chat.sender_id);

    if (!friend_data || !user_data) {
      throw new Error("Users not found");
      continue;
    }

    const selected_user_data = {
      user_id: user_data.id,
      name: user_data.name,
      email: user_data.email,
      username: user_data.username,
    };
    const selected_friend_data = {
      friend_id: friend_data.id,
      name: friend_data.name,
      email: friend_data.email,
      username: friend_data.username,
    };

    const selected_chat_data = {
      chat_id: chat.chat_id,
      read_status: chat.read_status,
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

const update_chat_read_status = async (access_token, chat_id, is_read) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });

  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const chat = await Chat.findByPk(chat_id);
  if (!chat) {
    throw new Error("Chat not found");
  }
  chat.read_status = is_read;
  return await chat.save();
};

module.exports = {
  createNewChat,
  getCurrentUsersChats,
  update_chat_read_status,
};
