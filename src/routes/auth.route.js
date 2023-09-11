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
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/verify-email",
  validate(authValidation.emailVerification),
  authController.emailVerification
);

module.exports = router;
