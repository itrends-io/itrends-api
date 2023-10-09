const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TeamInvite = sequelize.define("TeamInvite", {
    team_invite_id: {
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invited_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  return TeamInvite;
};
