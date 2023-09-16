const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const {
  userController,
  followController,
  conversationController,
} = require("../controllers");

module.exports = router;

router.route("/conversation").post(conversationController.createConversation);

router
  .route("/:id/conversation")
  .get(conversationController.getCurrentUsersConversations);
