const { DataTypes, Op } = require("sequelize");
const paginate = require("../../config/paginate");

const userSettingAssociation = (User, Privacy) => {
  User.hasOne(Privacy, {
    foreignKey: "user_id",
    as: "privacy and settings",
  });
  Privacy.belongsTo(User, {
    foreignKey: "user_id",
    as: "privacy and settings",
  });
};

module.exports = {
  userSettingAssociation,
};
