const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Setting = sequelize.define("Setting", {
    settings_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
  });
  return Setting;
};
