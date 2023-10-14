const httpStatus = require("http-status");
const { userSettingService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");

const manage_privacy_settings = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await userSettingService.manage_privacy_settings(
    token,
    req.body
  );
  res.status(httpStatus.ACCEPTED).send({ message: "settings saved" });
});

const get_all_privacy_settings = catchAsync(async (req, res) => {
  if (!req.headers.authorization) {
    throw new Error("Token is required");
  }
  const [, token] = req.headers.authorization.split(" ");
  const data = await userSettingService.get_all_privacy_settings(token);
  res.status(httpStatus.ACCEPTED).send({ data: data, message: "success" });
});

module.exports = {
  manage_privacy_settings,
  get_all_privacy_settings,
};
