const express = require("express");
const userRoute = require("./user.route");
const postRoute = require("./post.route");
const authRoute = require("./auth.route");
const chatRoute = require("./chat.route");
const teamRoute = require("./team.route");
const userSettingRoute = require("./user-setting.route");

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
    route: chatRoute,
  },
  {
    path: "/posts",
    route: postRoute,
  },
  {
    path: "/teams",
    route: teamRoute,
  },
  {
    path: "/settings",
    route: userSettingRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
