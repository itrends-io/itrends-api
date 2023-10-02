const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");

const basename = path.basename(__filename);
const db = {};

const connectionString = config.pg.url;

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
});

const loadModelsRecursive = (directory) => {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      loadModelsRecursive(filePath);
    } else if (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    ) {
      const model = require(filePath)(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });
};

loadModelsRecursive(__dirname);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
