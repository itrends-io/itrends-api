const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Follower = sequelize.define("Follower", {
    follow_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    follower_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    followee_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Follower;
};
