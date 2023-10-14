const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userSettingController } = require("../controllers");
const { userSettingValidation } = require("../validations");

module.exports = router;

router
  .route("/manage")
  .put(
    validate(userSettingValidation.manage_privacy_settings),
    userSettingController.manage_privacy_settings
  )
  .get(
    validate(userSettingValidation.get_all_privacy_settings),
    userSettingController.get_all_privacy_settings
  );
