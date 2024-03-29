const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "demo")
      .required(),
    PORT: Joi.number().default(8005),
    SOCKETPORT: Joi.number().default(8500),
    CLIENT_URL: Joi.string().allow("").default("https://itrends.io"),
    DATABASE_URL: Joi.string().required().description("PG Dev DB url"),
    LOCAL_DB: Joi.string().description("PG Demo DB url"),
    MESSAGEBIRD_API_KEY: Joi.string().description("2FA SMS"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
  })
  .unknown();

const { value: envVars, error } = envVarSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  socketport: envVars.SOCKETPORT,
  message_bird_key: envVars.MESSAGEBIRD_API_KEY,
  corsOrigin: envVars.NODE_ENV === "production" ? envVars.CLIENT_URL : "*",
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
    emailVerificationExpirationDays: 15,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  clientURL:
    envVars.NODE_ENV === "production"
      ? envVars.CLIENT_URL
      : "https://itrends.io",
  pg: {
    url: envVars.NODE_ENV === "demo" ? envVars.LOCAL_DB : envVars.DATABASE_URL,
    options: {},
  },
};
