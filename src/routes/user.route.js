const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");

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
  .route("/:userId/follow")
  .patch(validate(userValidation.followUserByPk), userController.followUser);
router
  .route("/:userId/unfollow")
  .delete(
    validate(userValidation.unFollowUserByPk),
    userController.unFollowUser
  );
