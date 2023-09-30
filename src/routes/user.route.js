const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userController } = require("../controllers");
const { userValidation } = require("../validations");

module.exports = router;

router
  .route("/self")
  .get(validate(userValidation.getOneUserByPk), userController.getUserByPk);

router
  .route("/")
  .get(validate(userValidation.getOneUserByPk), userController.getUsers);

  router
    .route("/self")
    .get(validate(userValidation.getOneUserByPk), userController.getUserByPk);

  router
    .route("/")
    .get(validate(userValidation.getOneUserByPk), userController.getUsers);