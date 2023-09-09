const { DataTypes } = require("sequelize");
const { tokenTypes } = require("../config/token");

module.exports = (sequelize) => {
  const Token = sequelize.define("Token", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
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
