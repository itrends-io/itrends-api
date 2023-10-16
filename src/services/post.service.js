const httpStatus = require("http-status");
const {
  User,
  Post,
  TaggedUser,
  PollOption,
  sequelize,
} = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const { postAssociation } = require("../associations/post.associations");

postAssociation(User, Post, TaggedUser, PollOption);

const createPost = async (token, text, tagged_users, poll_options) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Ensure you are logged in");
  }
  if (!text || text === "")
    throw new ApiError(httpStatus.NOT_FOUND, "text field connot be empty");

  const [, accessToken] = token.split(" ");

  const currUser = await verifyToken(accessToken, tokenTypes.ACCESS);

  const post_data = await Post.create({
    user_id: currUser.userId,
    text,
    poll_options,
  });

  // if (poll_options && poll_options.length > 0) {
  //   const createdPollOptions = await Promise.all(
  //     poll_options.map((option) =>
  //       PollOption.create({
  //         post_id: post_data.post_id,
  //         option: option.option,
  //         count: 0,
  //       })
  //     )
  //   );

  //   post_data.dataValues.poll_options = createdPollOptions;
  // }

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

    const taggedUserIds = userInstances.map(
      ([userInstance, created]) => userInstance.user_id
    );

    for (const user_id of taggedUserIds) {
      await sequelize.query(
        `INSERT INTO "PostTaggedUsers" (post_id, user_id, "createdAt", "updatedAt") VALUES (?, ?, ?, ?)`,
        {
          replacements: [post_data.post_id, user_id, new Date(), new Date()],
          type: sequelize.QueryTypes.INSERT,
        }
      );
    }

    // await post_data.addTaggedUsers(taggedUserIds);

    post_data.dataValues.tagged_users = taggedUserIds;
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
        as: "tagged_users",
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
