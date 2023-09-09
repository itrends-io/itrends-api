const { Pool } = require("pg");
const pool = new Pool(
  "postgres://itrends:HwGb4MzgWu5HBwuYd81cLoteIQTqAdaw@dpg-cju80515mpss73c8navg-a.oregon-postgres.render.com/itrends"
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
