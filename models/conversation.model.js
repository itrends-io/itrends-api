const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Conversation = sequelize.define("Conversation", {
    conversationId: {
      type: DataTypes.UUID,
      // allowNull: false,
      primaryKey: true,
    },
    users: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
  });
  return Conversation;
};
