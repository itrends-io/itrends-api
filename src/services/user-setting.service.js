const httpStatus = require("http-status");
const {
  User,
  Token,
  Post,
  Privacy,
  Setting,
  Fans_and_following,
} = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const {
  userSettingAssociation,
} = require("../associations/user-setting.association");

userSettingAssociation(User, Privacy, Fans_and_following, Setting);

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

  const existing_fan_settings = await Fans_and_following.findOne({
    where: { user_id: get_user_token_doc.userId },
  });
  if (!existing_fan_settings) {
    await Privacy.create({ user_id: get_user_token_doc.userId });
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

const get_all_settings = async (access_token) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });

  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const userId = get_user_token_doc.userId;

  let settings = await Setting.findOne({
    where: { user_id: userId },
    include: [
      {
        model: Privacy,
        as: "privacy",
      },
      {
        model: Fans_and_following,
        as: "fans_and_following",
      },
    ],
  });

  // If settings don't exist, create default settings
  if (!settings) {
    const existingPrivacySettings = await Privacy.findOne({
      where: { user_id: userId },
    });

    if (!existingPrivacySettings) {
      await Privacy.create({ user_id: userId });
    }

    const existingFanSettings = await Fans_and_following.findOne({
      where: { user_id: userId },
    });

    if (!existingFanSettings) {
      await Fans_and_following.create({ user_id: userId });
    }

    // Create default settings with associations
    settings = await Setting.create({
      user_id: userId,
    });

    // Re-fetch settings to include associations
    settings = await Setting.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Privacy,
          as: "privacy",
        },
        {
          model: Fans_and_following,
          as: "fans_and_following",
        },
      ],
    });
  }

  return settings;
};

module.exports = {
  manage_privacy_settings,
  get_all_privacy_settings,
  get_all_settings,
  manage_fans_and_following,
};
