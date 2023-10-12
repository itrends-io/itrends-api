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
  res
    .status(httpStatus.ACCEPTED)
    .send({ data: data, message: "settings saved" });
});

module.exports = {
  manage_privacy_settings,
};
