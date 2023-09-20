const express = require("express");
const usersRoute = require("./users.route");
const userRoute = require("./user.route");
const postRoute = require("./post.route");
const authRoute = require("./auth.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: usersRoute,
  },
  {
    path: "/user",
    route: userRoute,
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
