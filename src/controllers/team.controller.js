const httpStatus = require("http-status");
const { userService, tokenService, teamService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const pick = require("../utils/pick");

const create_team = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await teamService.create_team(token, req.body);
  // res.status(httpStatus.ACCEPTED).send({ message: "Post saved" });
});

module.exports = {
  create_team,
};
