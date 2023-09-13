const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");

module.exports = router;

router
  .route("/:userId")
  .get(validate(userValidation.getOneUserByPk), userController.getUserByPk);
