const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");

router.post(
  "/register",
  validate(userValidation.registerUser),
  userController.registerUser
);
router.post(
  "/login",
  validate(userValidation.login),
  userController.loginUserWithEmailAndPassword
);

module.exports = router;
