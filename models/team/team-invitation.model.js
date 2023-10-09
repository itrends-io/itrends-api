const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TeamInvite = sequelize.define("TeamInvite", {
    team_invitation_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return TeamInvite;
};
