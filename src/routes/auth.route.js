const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");

router.post(
  "/register",
  validate(authValidation.register),
  authController.registerUser
);
router.post(
  "/login",
  validate(authValidation.login),
  authController.loginUserWithEmailAndPassword
);
router.post(
  "/logout",
  validate(authValidation.logout),
  authController.logoutUser
);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
router.post(
  "/verify-email",
  validate(authValidation.emailVerification),
  authController.emailVerification
);
router.post(
  "/change-password",
  validate(authValidation.changePassword),
  authController.changePassword
);

module.exports = router;
