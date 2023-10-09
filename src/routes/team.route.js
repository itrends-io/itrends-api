const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation, teamValidation } = require("../validations");
const { teamController } = require("../controllers");

module.exports = router;

router
  .route("/")
  .post(validate(teamValidation.create_team), teamController.create_team);
