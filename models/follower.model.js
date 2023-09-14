const { DataTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const Follower = sequelize.define("Follower", {
    followId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Follower;
};
