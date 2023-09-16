const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    conversationId: {
      type: DataTypes.INTEGER,
    },
    senderId: {
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.STRING,
    },
    read_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  return Message;
};
