const { DataTypes, Op } = require("sequelize");

const chatAssociation = (User, Chat, Message) => {
  User.belongsToMany(User, {
    through: Chat,
    as: "SenderChats",
    foreignKey: "chat_sender_id",
    type: DataTypes.UUID,
  });

  User.belongsToMany(User, {
    through: Chat,
    as: "ReceiverChats",
    foreignKey: "chat_receiver_id",
    type: DataTypes.UUID,
  });

  Chat.hasMany(Message, {
    foreignKey: "chat_id",
    as: "chat",
    type: DataTypes.UUID,
  });

  Message.belongsTo(User, {
    foreignKey: "sender_id",
    as: "sender",
    type: DataTypes.UUID,
  });

  User.hasMany(Message, {
    foreignKey: "sender_id",
    as: "sentMessages",
    type: DataTypes.UUID,
  });
};

module.exports = {
  chatAssociation,
};
