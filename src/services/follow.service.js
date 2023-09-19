const httpStatus = require("http-status");
const { DataTypes } = require("sequelize");
const { User, Token, Follower } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { getUserById } = require("./user.service");

User.hasMany(Follower, {
  foreignKey: "user_follower_id",
  as: "follower",
  primaryKey: true,
  unique: true,
  defaultValue: DataTypes.UUIDV4,
});

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
  const isAlreadyFollowing = await Follower.findOne({
    where: {
      user_follower_id: curr_user.id,
      user_following_id: userToFollow.id,
    },
  });

  if (isAlreadyFollowing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already following this user");
  }
  const follower = await Follower.create({
    user_follower_id: curr_user.id,
    user_following_id: userToFollow.id,
  });

  await curr_user.increment("followingCount");
  await userToFollow.increment("followersCount");

  return follower;
};

const unFollowUser = async (currUserId, token, userToFollowId) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  const [, accessToken] = token.split(" ");
  const currUser = await getUserById(currUserId, accessToken);
  const userToFollow = await User.findByPk(userToFollowId);
  if (!userToFollow) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const isAlreadyFollowing = await Follower.findOne({
    where: {
      followerId: currUser.id,
      followingId: userToFollow.id,
    },
  });

  if (!isAlreadyFollowing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not following this user");
  }
  const unFollow = await Follower.destroy({
    where: {
      followerId: currUser.id,
      followingId: userToFollow.id,
    },
  });

  await currUser.decrement("followingCount");
  await userToFollow.decrement("followersCount");

  return unFollow;
};

module.exports = {
  followUser,
  unFollowUser,
};
