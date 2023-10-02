const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MessageInteraction = sequelize.define("MessageInteraction", {
    message_interaction_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("like", "pin", "hide", "delete", "report"),
      allowNull: false,
    },
  });
  return MessageInteraction;
};
