const { Pool } = require("pg");

const pool = new Pool({
  username: "postgres",
  password: "password",
  database: "itrends",
  host: "localhost",
  port: "5432",
  dialect: "postgres",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
