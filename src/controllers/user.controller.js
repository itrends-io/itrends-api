const httpStatus = require("http-status");
const { userService, tokenService, emailService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const getUserByPk = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const user = await userService.getSelf(token);
  res.status(httpStatus.ACCEPTED).send({ user, message: "" });
});

const getUsers = catchAsync(async (req, res) => {
  const { id, email, username } = req.query;
  let user;
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  if (id) {
    user = await userService.getUserById(id, token);
    res.status(httpStatus.ACCEPTED).send({ user, message: "success" });
  } else if (email) {
    user = await userService.getUserByEmail(email);
    res.status(httpStatus.ACCEPTED).send({ user, message: "success" });
  } else if (username) {
    user = await userService.getUserByUsername(username);
    res.status(httpStatus.ACCEPTED).send({ user, message: "success" });
  } else {
    const users = await userService.getAllUsers(token);
    res.status(httpStatus.ACCEPTED).send({ users, message: "success" });
  }
});

const updateUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updateFields = req.body;
  const user = await userService.updateUserById(userId, updateFields);
  const message = "User updated successfully";
  res.status(204).send({
    message,
    user,
  });
});

module.exports = {
  getUserByPk,
  getUsers,
  updateUserById,
};
