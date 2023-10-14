const httpStatus = require("http-status");
const {
  userService,
  tokenService,
  emailService,
  authService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const cloudinary = require("../utils/Cloudinary");

const getUserByPk = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const user = await userService.getSelf(token);
  const userData = await authService.generateUserData(user);
  res.status(httpStatus.ACCEPTED).send({ user: userData, message: "" });
});

const getUsersByQuery = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const user = await userService.getUserInfo(req.query, token);
  const userData = await authService.generateUserData(user);
  res.status(httpStatus.ACCEPTED).send({ user: userData, message: "success" });
});

const getAllUsers = catchAsync(async (req, res) => {
  const { id, email, username } = req.query;
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const users = await userService.getAllUsers(token);
  res.status(httpStatus.ACCEPTED).send({ users, message: "success" });
});

const updateUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updateFields = req.body;

  const updatedUserData = await userService.uploadImages(req.files);

  const mergedUpdateFields = {
    ...updateFields,
    ...updatedUserData,
  };

  const user = await userService.updateUserById(userId, mergedUpdateFields);

  const message = "User updated successfully";
  res.status(httpStatus.ACCEPTED).send({
    message,
    user,
  });
});

module.exports = {
  getAllUsers,
  getUserByPk,
  getUsersByQuery,
  updateUserById,
};
