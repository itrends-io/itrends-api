const { DataTypes, Op } = require("sequelize");
const paginate = require("../../config/paginate");

const teamAssociation = (User, TeamInvite, Team) => {
  paginate(Team);

  User.belongsTo(Team, {
    foreignKey: "team_id",
    as: "users",
    type: DataTypes.UUID,
  });

  Team.hasMany(User, {
    as: "users",
    foreignKey: "team_id",
    type: DataTypes.UUID,
  });

  TeamInvite.belongsTo(Team, { foreignKey: "team_id", type: DataTypes.UUID });

  Team.hasMany(TeamInvite, {
    as: "team_invite",
    foreignKey: "team_id",
    type: DataTypes.UUID,
  });

  // Team.belongsTo(User, {
  //   as: "owner",
  //   // foreignKey: "owner_id",
  //   // type: DataTypes.UUID,
  // });
};

module.exports = {
  teamAssociation,
};
