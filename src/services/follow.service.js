const httpStatus = require("http-status");
const { User, Token, Follower } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { getUserById } = require("./user.service");

User.hasMany(Follower, {
  foreignKey: "followerId",
  as: "follower",
});

const followUser = async (currUserId, token, userToFollowId) => {
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

  if (isAlreadyFollowing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already following this user");
  }
  const follower = await Follower.create({
    followerId: currUser.id,
    followingId: userToFollow.id,
  });

  await currUser.increment("followingCount");
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
