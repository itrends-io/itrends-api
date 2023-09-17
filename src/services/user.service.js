const httpStatus = require("http-status");
const { User, Token } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { verifyToken } = require("./token.service");
const cloudinary = require("../utils/Cloudinary");

const getSelf = async (accessToken) => {
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
  const user = await User.findByPk(getUserTokenDoc.userId);
  return user;
};

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
  const user = await User.findByPk(userId);
  return user;
};

const getAllUsers = async (accessToken) => {
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

  const users = await User.findAll();
  return users;
};

const getUserByEmail = async (email) => {
  return User.findOne({
    where: { email: email },
  });
};

const getUserByUsername = async (username) => {
  return User.findOne({
    where: { username: username },
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

const uploadImages = async (files) => {
  const imageMappings = {
    profile_photo: "profile_photo",
    cover_photo: "cover_photo",
  };
  const updatedUserData = {};

  const uploadPromises = [];
  for (const file of files) {
    const fieldName = file.fieldname.trim();
    const mappedField = imageMappings[fieldName];
    if (mappedField) {
      uploadPromises.push(
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file.path, (err, result) => {
            if (err) {
              console.error("error");
              reject(err);
            } else {
              console.log("success");
              updatedUserData[mappedField] = result.secure_url;
              resolve();
            }
          });
        })
      );
    }
  }

  await Promise.all(uploadPromises);
  return updatedUserData;
};

const getUserInfo = async (query, token) => {
  const { id, email, username } = query;
  let user;
  if (id) {
    user = await getUserById(id, token);
  } else if (email) {
    user = await getUserByEmail(email);
  } else if (username) {
    user = await getUserByUsername(username);
  } else {
    const users = await getAllUsers(token);
  }
  return user;
};

module.exports = {
  getUserById,
  getSelf,
  getUserByEmail,
  updateUserById,
  getAllUsers,
  getUserByUsername,
  uploadImages,
  getUserInfo,
};
