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
  });
  return Privacy;
};
