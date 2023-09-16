const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    conversationId: {
      type: DataTypes.UUID,
    },
    senderId: {
      type: DataTypes.UUID,
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
