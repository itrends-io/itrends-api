const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation, conversationValidation } = require("../validations");
const {
  userController,
  followController,
  conversationController,
} = require("../controllers");

module.exports = router;

router
  .route("/conversation")
  .post(
    validate(conversationValidation.createConversation),
    conversationController.createConversation
  );

router
  .route("/conversation")
  .get(
    validate(conversationValidation.get_current_conversation),
    conversationController.getCurrentUsersConversations
  );
