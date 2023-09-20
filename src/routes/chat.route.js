const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { userValidation, chatValidation } = require("../validations");
const {
  userController,
  followController,
  chatController,
  messageController,
} = require("../controllers");

module.exports = router;

router
  .route("/")
  .post(validate(chatValidation.createChat), chatController.createChat);

router
  .route("/conversation")
  .get(
    validate(chatValidation.get_current_conversation),
    chatController.getCurrentUsersConversations
  );

router
  .route("/message")
  .post(
    validate(chatValidation.create_message),
    messageController.create_message
  )
  .get(validate(chatValidation.get_messages), messageController.get_messages);
