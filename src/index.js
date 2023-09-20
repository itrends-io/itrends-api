const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const httpStatus = require("http-status");
const http = require("http");
const cookieParser = require("cookie-parser");
const config = require("../config/config");
const routes = require("./routes");
const session = require("express-session");
const passport = require("passport");
const { Server } = require("socket.io");
const socketRoutes = require("./sockets");
const {
  errorConverter,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();
const db = require("../models");
const logger = require("../config/logger");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(xss());
app.use(cookieParser());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middelware
app.use(passport.initialize());
app.use(passport.session());

const corsConfig = {
  origin: config.corsOrigin,
  credentials: true,
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    // origin: config.corsOriginSocket,
    methods: ["GET", "POST"],
  },
});

socketRoutes(io);

app.use("/api/v1", routes);

app.use(errorConverter);
app.use(errorHandler);

db.sequelize.sync().then((req) => {
  logger.info(`Connected to POSTGRES DB: ${config.pg.url}`);
  app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
    server.listen(config.socketport, () => {
      logger.info(`Socket is running ${config.socketport}`);
    });
  });
});
