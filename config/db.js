const { Pool } = require("pg");

const pool = new Pool(process.env.DATABASE_URL);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
