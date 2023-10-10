const httpStatus = require("http-status");
const {
  userService,
  tokenService,
  teamService,
  emailService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const pick = require("../utils/pick");
const { User, Token, TeamInvite, Team } = require("../../models");

const create_team = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await teamService.create_team(token, req.body);
  res.status(httpStatus.ACCEPTED).send({ data: data, message: "Team created" });
});

const get_team_by_id = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await teamService.get_team_by_id(token, req.body);
  res
    .status(httpStatus.ACCEPTED)
    .send({ data: data, message: "Retrieve teams" });
});

const create_team_invitation = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");

  try {
    await emailService.transport.verify();
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Unable to send invitation email."
    );
  }

  console.log(req.params.team_id);

  const team = await Team.findByPk(req.params.team_id, {
    include: [
      { model: User, as: "users" },
      { model: TeamInvite, as: "team_invite" },
    ],
  });

  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }

  for (const user of team.users) {
    if (req.body.email === user.email) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Email is already a part of the team"
      );
    }
  }

  for (const invitation of team.team_invite) {
    if (req.body.email === invitation.email) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invitation has already been sent to this email"
      );
    }
  }

  const data = await teamService.create_team_invitation(
    token,
    req.body,
    req.params
  );

  await emailService.sendTeamInvitationEmail(
    req.body.email,
    team,
    data.team_invite_id
  );

  res
    .status(httpStatus.ACCEPTED)
    .send({ data: data, message: "Retrieve teams" });
});
const accept_team_invite = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const team = await teamService.accept_team_invite(
    token,
    req.params.team_id,
    req.body.team_invite_id
  );
  // if (req.user.email !== team.team_invite.email) {
  //   throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  // }
  res.status(httpStatus.ACCEPTED).send({ data: team, message: "success" });
});

module.exports = {
  create_team,
  get_team_by_id,
  create_team_invitation,
  accept_team_invite,
};
