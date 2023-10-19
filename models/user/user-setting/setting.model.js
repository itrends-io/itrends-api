const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Settings = sequelize.define("Settings", {
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
  return Settings;
};
