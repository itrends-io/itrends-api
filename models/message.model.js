const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    message_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    conversation_id: {
      type: DataTypes.UUID,
    },
    sender_id: {
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
