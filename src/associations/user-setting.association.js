const { DataTypes, Op } = require("sequelize");
const paginate = require("../../config/paginate");

const userSettingAssociation = (User, Privacy, Fans_and_following) => {
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
};

module.exports = {
  userSettingAssociation,
};
