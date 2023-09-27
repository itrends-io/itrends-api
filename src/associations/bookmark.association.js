const { DataTypes, Op } = require("sequelize");
const paginate = require("../../config/paginate");

const bookmarkAssociation = () => {
  paginate(Bookmark);

  User.hasMany(Bookmark, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    type: DataTypes.UUID,
  });
  Post.hasMany(Bookmark, {
    foreignKey: "post_id",
    onDelete: "CASCADE",
    type: DataTypes.UUID,
  });

  Bookmark.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    type: DataTypes.UUID,
  });

  Bookmark.belongsTo(Post, {
    foreignKey: "post_id",
    onDelete: "CASCADE",
    type: DataTypes.UUID,
  });
};

module.exports = { bookmarkAssociation };
