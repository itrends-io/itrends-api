const { DataTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const TaggedUser = sequelize.define("TaggedUser", {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  });

  return TaggedUser;
};
