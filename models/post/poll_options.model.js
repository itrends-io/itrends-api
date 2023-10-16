const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PollOption = sequelize.define("PollOption", {
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return PollOption;
};
