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

// Conversation.hasMany(Message, {
//   foreignKey: "messageId",
//   as: "message",
// });

const createNewConversation = async (friendId, accessToken) => {
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
  const friend_data = await User.findByPk(friendId);
  if (!friend_data) {
    throw new Error("User not found");
  }

  const is_already_conversing = await Conversation.findOne({
    where: {
      senderId: user_data.id,
      receiverId: friend_data.id,
    },
  });

  if (is_already_conversing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Already have a conversation this user"
    );
  }

  if (friend_data.id === user_data.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot create a conversation with yourself"
    );
  }
  const conversation_data = await Conversation.create({
    senderId: get_user_token_doc.userId,
    receiverId: friend_data.id,
  });

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

  const selected_conversation_data = {
    conversation_id: conversation_data.id,
    created_at: conversation_data.createdAt,
    updated_at: conversation_data.updatedAt,
  };

  return {
    selected_user_data,
    selected_friend_data,
    selected_conversation_data,
  };
};

const getCurrentUsersConversations = async (access_token) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }
  const conversation_data = await Conversation.findAll({
    where: {
      senderId: get_user_token_doc.userId,
    },
  });

  if (!conversation_data) {
    throw new Error("Not data found");
  }

  const selectedConversations = [];

  for (const conversation of conversation_data) {
    const friend_data = await User.findByPk(conversation.receiverId);
    const user_data = await User.findByPk(conversation.senderId);

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

    const selected_conversation_data = {
      conversation_id: conversation.id,
      created_at: conversation.createdAt,
      updated_at: conversation.updatedAt,
    };

    selectedConversations.push({
      selected_user_data,
      selected_friend_data,
      selected_conversation_data,
    });
  }

  return selectedConversations;

  // const friend_data = await User.findByPk(conversation_data.receiverId);
  // const user_data = await User.findByPk(conversation_data.senderId);

  // console.log(friend_data);

  // const selected_user_data = {
  //   id: user_data.id,
  //   name: user_data.name,
  //   email: user_data.email,
  //   username: user_data.username,
  // };
  // const selected_friend_data = {
  //   id: friend_data.id,
  //   name: friend_data.name,
  //   email: friend_data.email,
  //   username: friend_data.username,
  // };

  // const selected_conversation_data = {
  //   conversation_id: conversation_data.id,
  //   created_at: conversation_data.createdAt,
  //   updated_at: conversation_data.updatedAt,
  // };

  // return {
  //   selected_user_data,
  //   selected_friend_data,
  //   selected_conversation_data,
  // };
};

module.exports = { createNewConversation, getCurrentUsersConversations };
