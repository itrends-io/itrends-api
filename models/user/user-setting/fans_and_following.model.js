const bcrypt = require("bcryptjs");
const { DataTypes, Op } = require("sequelize");

module.exports = (sequelize) => {
  const Fans_and_following = sequelize.define("Fans_and_following", {
    fans_and_following_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    is_auto_follow_back: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_auto_unfollow_back: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    send_awards_top1: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    send_awards_top5: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return Fans_and_following;
};
