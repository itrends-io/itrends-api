const express = require("express");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const conversationRoute = require("./conversation.route");

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
    path: "/chat",
    route: conversationRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
