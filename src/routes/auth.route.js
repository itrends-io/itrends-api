const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");
const passport = require("passport");

router.post(
  "/register",
  validate(authValidation.register),
  authController.registerUser
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const redirectURL = "https://localhost:8000/api/v1/auth/google/callback";
    res.redirect(redirectURL);
  }
);

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/",
    session: true,
  }),
  function (req, res) {
    res.redirect("https://localhost:8000/api/v1/auth/twitter/callback");
  }
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
