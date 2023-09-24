const httpStatus = require("http-status");
const { DataTypes } = require("sequelize");
const { User, Token, Follower } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { followAssociation } = require("../associations/follow.association");

followAssociation(User);

const followUser = async (token, userToFollowId) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  const [, access_token] = token.split(" ");
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const curr_user = await User.findByPk(get_user_token_doc.userId);

  const userToFollow = await User.findByPk(userToFollowId);
  if (!userToFollow) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isAlreadyFollowing = await curr_user.hasFollowing(userToFollow);

  if (isAlreadyFollowing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already following this user");
  }

  const follower = await curr_user.addFollowing(userToFollow);

  await curr_user.increment("following_count");
  await userToFollow.increment("followers_count");

  return follower;
};

const unFollowUser = async (token, user_to_follow_id) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  const [, access_token] = token.split(" ");
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const curr_user = await User.findByPk(get_user_token_doc.userId);

  const user_to_follow = await User.findByPk(user_to_follow_id);
  if (!user_to_follow) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isAlreadyFollowing = await curr_user.hasFollowing(user_to_follow);

  if (!isAlreadyFollowing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not following this user");
  }

  await curr_user.removeFollowing(user_to_follow);

  await curr_user.decrement("following_count");
  await user_to_follow.decrement("followers_count");

  return unFollow;
};

const getFollowing = async (user_id) => {
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const following = await user.getFollowing();
  return following;
};

const getFollowers = async (user_id) => {
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const followers = await user.getFollowers();
  return followers;
};

const get_all_followings_list = async (token) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  const [, access_token] = token.split(" ");
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const user = await User.findByPk(get_user_token_doc.userId);

  const followingList = await getFollowing(user.user_id);

  if (!followingList || followingList.length <= 0) {
    throw new Error("You follow 0 people");
  }

  return followingList;
};

const get_all_followers_list = async (token) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  const [, access_token] = token.split(" ");
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const user = await User.findByPk(get_user_token_doc.userId);

  const followersList = await getFollowers(user.user_id);

  if (!followersList || followersList.length <= 0) {
    throw new Error("You have 0 followers");
  }

  return followersList;
};

module.exports = {
  followUser,
  unFollowUser,
  get_all_followings_list,
  get_all_followers_list,
};
