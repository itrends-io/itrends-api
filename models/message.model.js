const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    messageId: {
      type: DataTypes.UUID,
      // allowNull: false,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
    },
    message: {
      type: DataTypes.STRING,
    },
  });
  return Message;
};
