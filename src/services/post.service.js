const httpStatus = require("http-status");
const { User, Post, TaggedUser } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { postAssociation } = require("../associations/post.associations");

postAssociation(User, Post, TaggedUser);

const createPost = async (token, text, tagged_users) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  if (!text || text === "")
    throw new ApiError(httpStatus.NOT_FOUND, "Post field connot be empty");

  const [, accessToken] = token.split(" ");

  const currUser = await verifyToken(accessToken, tokenTypes.ACCESS);

  const post_data = await Post.create({
    user_id: currUser.userId,
    text,
  });

  if (tagged_users && tagged_users.length > 0) {
    const userInstances = await Promise.all(
      tagged_users.map((user_id) =>
        TaggedUser.findOrCreate({
          where: {
            user_id: user_id,
          },
        })
      )
    );

    const taggedUsers = userInstances.map(
      ([userInstance, created]) => userInstance
    );

    await post_data.addTaggedUsers(taggedUsers);

    post_data.dataValues.tagged_users = taggedUsers;
  }

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

  const userPosts = await user.getPosts({
    include: [
      // Include the tagged users
      {
        model: TaggedUser,
        as: "tagged_users", // Use the alias defined in your association
        through: { attributes: [] },
      },
    ],
  });

  return userPosts;
};

module.exports = {
  createPost,
  getAllMyPosts,
};
