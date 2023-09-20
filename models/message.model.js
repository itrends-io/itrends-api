const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    conversation_id: {
      type: DataTypes.INTEGER,
    },
    sender_id: {
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
