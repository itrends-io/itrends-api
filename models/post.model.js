const bcrypt = require("bcryptjs");
const { DataTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const Post = sequelize.define(
    "Post",
    {
      postId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4(),
        primaryKey: true,
      },
      user: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4(),
      },
      post: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  // Post.belongsTo(sequelize.models.User, { foreignKey: "userId" });

  return Post;
};
