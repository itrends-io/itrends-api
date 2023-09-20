const { DataTypes } = require("sequelize");
const { tokenTypes } = require("../config/token");

module.exports = (sequelize) => {
  const Token = sequelize.define("Token", {
    token_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            tokenTypes.ACCESS,
            tokenTypes.REFRESH,
            tokenTypes.RESET_PASSWORD,
            tokenTypes.EMAIL_VERIFICATION,
          ],
        ],
      },
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Token;
};
