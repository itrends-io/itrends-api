const { DataTypes, Op } = require("sequelize");
const paginate = require("../../config/paginate");

const userSettingAssociation = (User, Privacy, Fans_and_following, Setting) => {
  User.hasOne(Privacy, {
    foreignKey: "user_id",
    as: "privacy and settings",
  });
  Privacy.belongsTo(User, {
    foreignKey: "user_id",
    as: "privacy and settings",
  });

  User.hasOne(Fans_and_following, {
    foreignKey: "user_id",
    as: "fans and following",
  });

  Fans_and_following.belongsTo(User, {
    foreignKey: "user_id",
    as: "fans and following",
  });

  Setting.belongsTo(Privacy, {
    foreignKey: "user_id",
    as: "privacy",
  });

  Setting.belongsTo(Fans_and_following, {
    foreignKey: "user_id",
    as: "fans_and_following",
  });

  User.hasOne(Setting, {
    foreignKey: "user_id",
    as: "settings",
  });
};

module.exports = {
  userSettingAssociation,
};
