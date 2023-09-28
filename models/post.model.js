const bcrypt = require("bcryptjs");
const { DataTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const Post = sequelize.define(
    "Post",
    {
      post_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      post: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      taggedUsers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      media: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      pollOptions: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return Post;
};
