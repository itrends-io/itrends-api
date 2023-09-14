const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");

const basename = path.basename(__filename);
const db = {};

// const connectionString = config.pg.url;
const connectionString =
  "postgres://cmzhebcjxdklny:1377202b2738fe15090fdb7b1364d9e633374017e563ebe7e059d303208c2cd2@ec2-35-169-9-79.compute-1.amazonaws.com:5432/detgkp59l1kqjk";

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
