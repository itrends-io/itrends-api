const httpStatus = require("http-status");
const {
  User,
  Token,
  Post,
  Privacy,
  Fans_and_following,
} = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const {
  userSettingAssociation,
} = require("../associations/user-setting.association");

userSettingAssociation(User, Post, Privacy);

const manage_privacy_settings = async (access_token, data) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const existingPrivacySettings = await Privacy.findOne({
    where: { user_id: get_user_token_doc.userId },
  });

  if (!existingPrivacySettings) {
    await Privacy.create({ user_id: get_user_token_doc.userId });
  }

  const updatedRows = await Privacy.update(data, {
    where: { user_id: get_user_token_doc.userId },
    returning: true,
    individualHooks: true,
  });

  if (updatedRows === 0) {
    throw new Error("User not found");
  }

  if (!updatedRows) {
    throw new Error("Error updating privacy settings");
  }

  return updatedRows[1][0];
};

const get_all_privacy_settings = async (access_token) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const existingPrivacySettings = await Privacy.findOne({
    where: { user_id: get_user_token_doc.userId },
  });

  if (!existingPrivacySettings) {
    await Privacy.create({ user_id: get_user_token_doc.userId });
  }

  const privacySettings = await Privacy.findOne({
    where: { user_id: get_user_token_doc.userId },
  });

  if (!privacySettings) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return privacySettings;
};

const manage_fans_and_following = async (access_token, data) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const existingFanSettings = await Fans_and_following.findOne({
    where: { user_id: get_user_token_doc.userId },
  });

  if (!existingFanSettings) {
    await Fans_and_following.create({ user_id: get_user_token_doc.userId });
  }

  const updatedRows = await Fans_and_following.update(data, {
    where: { user_id: get_user_token_doc.userId },
    returning: true,
    individualHooks: true,
  });

  if (updatedRows === 0) {
    throw new Error("User not found");
  }

  if (!updatedRows) {
    throw new Error("Error updating fan settings");
  }

  return updatedRows[1][0];
};

const get_all_fans_and_following_settings = async (access_token) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const existing_fans_settings = await Fans_and_following.findOne({
    where: { user_id: get_user_token_doc.userId },
  });

  if (!existing_fans_settings) {
    await Fans_and_following.create({ user_id: get_user_token_doc.userId });
  }

  const fanSettings = await Fans_and_following.findOne({
    where: { user_id: get_user_token_doc.userId },
  });

  if (!fanSettings) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return fanSettings;
};

module.exports = {
  manage_privacy_settings,
  get_all_privacy_settings,
  manage_fans_and_following,
  get_all_fans_and_following_settings,
};
