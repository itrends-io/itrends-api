const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const { postController } = require("../controllers");

router.post("/create", postController.createPost);
router.get("/myposts", postController.getAllMyPosts);

module.exports = router;
