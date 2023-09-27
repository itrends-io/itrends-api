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
  .post(validate(chatValidation.createChat), chatController.createChat)
  .get(
    validate(chatValidation.get_current_conversation),
    chatController.getCurrentUsersChat
  );

router
  .route("/update")
  .patch(
    validate(chatValidation.update_chat_read_status),
    messageController.update_chat_read_status
  );

router
  .route("/message/like")
  .post(validate(chatValidation.like_message), messageController.like_message);

router
  .route("/message/unlike")
  .delete(
    validate(chatValidation.unlike_message),
    messageController.unlike_message
  );

router
  .route("/message/reply-message")
  .post(
    validate(chatValidation.reply_to_message),
    messageController.reply_to_message
  );
router
  .route("/message/pin")
  .post(validate(chatValidation.pin_message), messageController.pin_message);

router
  .route("/message/unpin")
  .delete(
    validate(chatValidation.unpin_message),
    messageController.unpin_message
  );

router
  .route("/message")
  .post(
    validate(chatValidation.create_message),
    messageController.create_message
  )
  .get(validate(chatValidation.get_messages), messageController.get_messages);
