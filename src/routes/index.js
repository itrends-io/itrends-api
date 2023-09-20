const express = require("express");
const userRoute = require("./user.route");
const postRoute = require("./post.route");
const authRoute = require("./auth.route");
const conversationRoute = require("./chat.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/chats",
    route: conversationRoute,
  },
  {
    path: "/posts",
    route: postRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
