const httpStatus = require("http-status");
const { User, Token, Post, Privacy } = require("../../models");
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

  const [updatedRows] = await Privacy.update(data, {
    where: { user_id: get_user_token_doc.userId },
    returning: true,
  });

  if (updatedRows === 0) {
    throw new Error("User not found");
  }

  if (!updatedRows) {
    throw new Error("Error updating privacy settings");
  }

  console.log(updatedRows);

  return updatedRows[1][0];
};

module.exports = {
  manage_privacy_settings,
};
