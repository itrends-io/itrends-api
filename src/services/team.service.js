const httpStatus = require("http-status");
const { User, Token, TeamInvite, Team } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { teamAssociation } = require("../associations/team.association");

teamAssociation(User, TeamInvite, Team);

const create_team = async (access_token, data) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }

  const team = await Team.create({
    team_name: data.team_name,
    team_owner: get_user_token_doc.userId,
    type: data.type,
  });
  return team;
};

const get_team_by_id = async (access_token, data) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }
  const team = await Team.findByPk(data.team_id, {
    include: [
      { model: User, as: "users" },
      { model: TeamInvite, as: "team_invite" },
    ],
  });
  if (!team) {
    throw new Error("Team not found");
  }
  return team;
};

module.exports = {
  create_team,
  get_team_by_id,
};
