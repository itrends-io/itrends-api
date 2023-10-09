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
};

module.exports = {
  create_team,
};