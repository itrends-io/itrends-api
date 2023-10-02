const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const { postController, followController } = require("../controllers");

router.post("/create", postController.createPost);

router.get("/taguser", followController.taggedUsers);

router.get("/myposts", postController.getAllMyPosts);

module.exports = router;
