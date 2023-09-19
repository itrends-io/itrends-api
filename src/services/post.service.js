const httpStatus = require("http-status");
const { User, Token, Post } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { getUserById } = require("./user.service");

// Post.belongsTo(User, {
//   foreignKey: "userId",
// });

const createPost = async (currUserId, token, post) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  if (!post || post === "") {
    throw new ApiError(httpStatus.NOT_FOUND, "Post field connot be empty");
  }
  const [, accessToken] = token.split(" ");
  const currUser = await getUserById(currUserId, accessToken);

  const post_data = await Post.create({
    user: currUserId,
    post,
  });

  return post_data;
};

module.exports = {
  createPost,
};
