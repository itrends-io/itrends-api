const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const { userController, followController } = require("../controllers");
const upload = require("../utils/multer");
module.exports = router;

router
  .route("/")
  .get(validate(userValidation.getOneUserByPk), userController.getAllUsers);

router
  .route("/:userId")
  .put(
    validate(userValidation.getOneUserByPk),
    upload.any(),
    userController.updateUserById
  );

router
  .route("/:userId/follow")
  .post(validate(userValidation.followUserByPk), followController.followUser);

router
  .route("/:userId/unfollow")
  .delete(
    validate(userValidation.unFollowUserByPk),
    followController.unFollowUser
  );
