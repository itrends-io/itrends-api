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
  .route("/:userId")
  .get(validate(userValidation.getOneUserByPk), userController.updateUserById);
router
  .route("/follow")
  .post(validate(userValidation.followUserByPk), followController.followUser);
router
  .route("/unfollow")
  .delete(
    validate(userValidation.unFollowUserByPk),
    followController.unFollowUser
  );
