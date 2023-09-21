const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Chat = sequelize.define("Chat", {
    chat_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });
  return Chat;
};
