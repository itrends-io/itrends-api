const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation, bookmarkValidation } = require("../validations");
const { postController, bookmarkController } = require("../controllers");

router.post("/create", postController.createPost);
router.get("/myposts", postController.getAllMyPosts);

router
  .route("/bookmark")
  .post(
    validate(bookmarkValidation.add_post_to_bookmark),
    bookmarkController.add_post_to_bookmark
  );

module.exports = router;
