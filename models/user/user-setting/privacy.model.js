const bcrypt = require("bcryptjs");
const { DataTypes, Op } = require("sequelize");

module.exports = (sequelize) => {
  const Privacy = sequelize.define("Privacy", {
    privacy_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    is_visible_online: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_profile_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    show_following_count: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    show_follower_count: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    show_media_count: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_login_redirect: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_allow_suggestions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_want_comment: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_comment_only_for_payers: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    show_post_tips_sum: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_watermark_photo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_watermark_video: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_watermark_text: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return Privacy;
};
