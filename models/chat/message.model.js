const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    message_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    sender_id: {
      type: DataTypes.UUID,
    },
    chat_id: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.STRING,
    },
    read_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    parent_message_id: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    pinned_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // hide_by: {
    //   type: DataTypes.ARRAY(DataTypes.STRING),
    //   defaultValue: [],
    // },
  });
  return Message;
};
