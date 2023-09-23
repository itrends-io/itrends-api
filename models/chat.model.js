const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Chat = sequelize.define("Chat", {
    chat_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    chat_sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    chat_receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    last_message_id: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
  });
  return Chat;
};
