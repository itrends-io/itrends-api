const httpStatus = require("http-status");
const { User, Token } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");

const getUserById = async (userId, accessToken) => {
  if (!accessToken) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token is required");
  }
  const getUserTokenDoc = await Token.findOne({
    where: {
      token: accessToken,
      type: tokenTypes.ACCESS,
    },
  });
  logger.info(getUserTokenDoc);
  if (!getUserTokenDoc) {
    throw new Error("Invalid or expired access token");
  }

  if (getUserTokenDoc.userId != userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not match user");
  }

  const user = await User.findByPk(getUserTokenDoc.userId);
  return user;
};

const getUserByEmail = async (email) => {
  return User.findOne({
    where: { email: email },
  });
};

const updateUserById = async (userId, updateBody) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User update failed");
  }
};

const followUser = async (currUserId, token, followingId) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  const [, accessToken] = token.split(" ");
  const currUser = await getUserById(currUserId, accessToken);
  const userToFollow = await User.findByPk(followingId);
  if (!userToFollow) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isFollowing = await currUser.hasFollowing(userToFollow);
  console.log(isFollowing);
  if (isFollowing) {
    throw new ApiError(httpStatus.NOT_MODIFIED, "Already following this user");
  }

  await currUser.addFollowing(userToFollow);
  await currUser.increment("followingCount");
  await userToFollow.increment("followersCount");
};

const unFollowUser = async (currUserId, token, followingId) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  const [, accessToken] = token.split(" ");
  const currUser = await getUserById(currUserId, accessToken);
  const userToUnFollow = await User.findByPk(followingId);
  if (!userToUnFollow) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const isFollowing = await currUser.hasFollowing(userToUnFollow);
  if (!isFollowing) {
    throw new ApiError(
      httpStatus.NOT_MODIFIED,
      "You are not following this user"
    );
  }
  await currUser.removeFollowing(userToUnFollow);
  await currentUser.decrement("followingCount");
  await userToUnfollow.decrement("followersCount");
};

module.exports = {
  getUserById,
  getUserByEmail,
  updateUserById,
  followUser,
  unFollowUser,
};
