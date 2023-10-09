const { DataTypes, Op } = require("sequelize");
const paginate = require("../../config/paginate");

const teamAssociation = (User, Team, TeamInvite) => {
  paginate(Team);

  User.belongsTo(Team, { foreignKey: "team_id" });

  Team.hasMany(User, { as: "users", foreignKey: "team_id" });

  TeamInvite.belongsTo(Team, { foreignKey: "team_id" });

  Team.belongsTo(User, {
    as: "owner",
    foreignKey: "owner_id",
    type: DataTypes.UUID,
  });

  Team.hasMany(TeamInvite, {
    as: "team_invite",
    foreignKey: "team_id",
  });
};

module.exports = {
  teamAssociation,
};
