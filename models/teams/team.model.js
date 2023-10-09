const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Team = sequelize.define("Team", {
    team_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    team_name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: true,
        len: [4, 40],
      },
    },
    owner_id: {
      type: DataTypes.UUID,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  });
  return Team;
};
