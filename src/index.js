const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const httpStatus = require("http-status");
const cookieParser = require("cookie-parser");
const config = require("../config/config");
const routes = require("./routes");
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

const corsConfig = {
  origin: config.corsOrigin,
  credentials: true,
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use("/api/v1", routes);

app.use(errorConverter);
app.use(errorHandler);

db.sequelize.sync().then((req) => {
  logger.info(`Connected to POSTGRES DB: ${config.pg.url}`);
  app.listen(config.port || 3000, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});
