const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userSettingController } = require("../controllers");
const { userSettingValidation } = require("../validations");

module.exports = router;

router
  .route("/privacy")
  .put(
    validate(userSettingValidation.manage_privacy_settings),
    userSettingController.manage_privacy_settings
  )
  .get(
    validate(userSettingValidation.get_all_privacy_settings),
    userSettingController.get_all_privacy_settings
  );
router
  .route("/fans")
  .put(
    validate(userSettingValidation.manage_fans_and_following),
    userSettingController.manage_fans_and_following
  );
