const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");

module.exports = router;

router
  .route("/:userId")
  .get(validate(userValidation.getOneUserByPk), userController.getUserByPk);
router
  .route("/:userId/follow")
  .patch(validate(userValidation.followUserByPk), userController.followUser);
router
  .route("/:userId/unfollow")
  .delete(
    validate(userValidation.unFollowUserByPk),
    userController.unFollowUser
  );
