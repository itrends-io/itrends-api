const { Pool } = require("pg");

const databaseConfig = {
  connectionString:
    "postgres://cmzhebcjxdklny:1377202b2738fe15090fdb7b1364d9e633374017e563ebe7e059d303208c2cd2@ec2-35-169-9-79.compute-1.amazonaws.com:5432/detgkp59l1kqjk",
  ssl: { rejectUnauthorized: false },
};

/* const client = new Client(process.env.DATABASE_URL); */
const pool = new Pool(databaseConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
