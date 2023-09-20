const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Follower = sequelize.define("Follower", {
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Follower;
};
