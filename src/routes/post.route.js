const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const {
  postController,
  followController,
  bookmarkController,
} = require("../controllers");
const { authValidation, bookmarkValidation } = require("../validations");

router.post("/create", postController.createPost);

router.get("/taguser", followController.taggedUsers);

router.get("/myposts", postController.getAllMyPosts);

router
  .route("/bookmark")
  .post(
    validate(bookmarkValidation.add_post_to_bookmark),
    bookmarkController.add_post_to_bookmark
  );

router
  .route("/bookmark")
  .get(
    validate(bookmarkValidation.get_all_bookmarked),
    bookmarkController.get_all_bookmarked
  );

router
  .route("/bookmark")
  .delete(
    validate(bookmarkValidation.remove_post_from_bookmark),
    bookmarkController.remove_post_from_bookmark
  );

module.exports = router;
