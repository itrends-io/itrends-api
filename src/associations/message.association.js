const { DataTypes, Op } = require("sequelize");
const paginate = require("../../config/paginate");

const messageAssociation = (User, MessageInteraction, Message) => {
  paginate(Message);
  MessageInteraction.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    type: DataTypes.UUID,
  });

  Message.hasMany(MessageInteraction, {
    foreignKey: "message_id",
    as: "interactions",
    type: DataTypes.UUID,
  });

  MessageInteraction.belongsTo(Message, {
    foreignKey: "message_id",
    as: "message",
    type: DataTypes.UUID,
  });
};

module.exports = {
  messageAssociation,
};
