const httpStatus = require("http-status");
const { User, Token, Post } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { getUserById } = require("./user.service");
const { postAssociation } = require("../associations/post.associations");

postAssociation(User, Post);

const createPost = async (token, post) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  if (!post || post === "") {
    throw new ApiError(httpStatus.NOT_FOUND, "Post field connot be empty");
  }
  const [, accessToken] = token.split(" ");

  const currUser = await verifyToken(accessToken, tokenTypes.ACCESS);

  const post_data = await Post.create({
    user_id: currUser.userId,
    post,
  });

  return post_data;
};

const getAllMyPosts = async (token) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }

  const [, accessToken] = token.split(" ");
  const currUser = await verifyToken(accessToken, tokenTypes.ACCESS);

  const user_id = currUser.userId;

  const user = await User.findByPk(user_id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found");
  }

  const userPosts = await user.getPosts();

  return userPosts;
};

module.exports = {
  createPost,
  getAllMyPosts,
};
