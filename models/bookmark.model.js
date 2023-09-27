const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Bookmark = sequelize.define("Bookmark", {
    bookmark_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
  });

  return Bookmark;
};
