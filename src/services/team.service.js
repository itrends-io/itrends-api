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
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }
  return team;
};

const create_team_invitation = async (access_token, body_data, params_data) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token");
  }
  const invite = await TeamInvite.create({
    username: body_data.username,
    email: body_data.email,
    role: body_data.role,
    team_id: params_data.team_id,
  });

  return invite;
};

const accept_team_invite = async (access_token, team_id, team_invite_id) => {
  const get_user_token_doc = await Token.findOne({
    where: {
      token: access_token,
      type: tokenTypes.ACCESS,
    },
  });
  if (!get_user_token_doc) {
    throw new Error("Invalid or expired access token or not a user");
  }

  const user = await User.findByPk(get_user_token_doc.userId);

  const team = await Team.findByPk(team_id, {
    include: [
      { model: User, as: "users" },
      { model: TeamInvite, as: "team_invite" },
    ],
  });

  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "You are not registered");
  }

  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }

  const find_team_invite = await TeamInvite.findByPk(team_invite_id);

  if (!find_team_invite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team invite not found");
  }

  // const is_team_invite_match = team.team_invite.team_invite_id == team_invite_id

  //  if (!is_team_invite_match) {
  //    throw new ApiError(httpStatus.NOT_FOUND, "W");
  //  }

  user.team_id = team.team_id;
  await user.save();
  find_team_invite.status = "accepted";
  await find_team_invite.save();

  return team;
};

module.exports = {
  create_team,
  get_team_by_id,
  create_team_invitation,
  accept_team_invite,
};
