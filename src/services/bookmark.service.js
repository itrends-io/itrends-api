const httpStatus = require("http-status");
const { User, Token, Post, Bookmark } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { bookmarkAssociation } = require("../associations/bookmark.association");

bookmarkAssociation(User, Post, Bookmark);

const add_post_to_bookmark = async (access_token, data) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const post = await Post.findByPk(data.post_id);
  if (!post) {
    throw new Error("post not found");
  }

  const is_already_bookmarked = await Bookmark.findOne({
    where: {
      post_id: post.post_id,
      user_id: get_user_token_doc.userId,
    },
  });

  if (is_already_bookmarked) {
    throw new Error("Already saved post");
  }

  const bookmark_post = await Bookmark.create({
    post_id: post.post_id,
    user_id: get_user_token_doc.userId,
  });

  return bookmark_post;
};

const get_all_bookmarked = async (access_token, data, filter, options) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const bookmarked_post = await Bookmark.findAll({
    where: {
      post_id: data.post_id,
    },
    include: [
      {
        model: Post,
      },
      {
        model: User,
      },
    ],
  });
 return bookmarked_post
 
};

module.exports = { add_post_to_bookmark, get_all_bookmarked };
