const
  config = require('../config/index'),
  fs = require("fs"),
  path = require("path");

let allDb;

async function init() {
  if (!allDb) {
    let mysqlDbPromise = createMysqlDatabases();
    /** Here create promises for others DBs **/

    await mysqlDbPromise;
    /** Here await others DBs **/

    allDb = {
      mysql: getMysqlConnection()
      /** Here init others DBs models **/
    };
    syncAll();
  }
}

function getAllDatabases() {
  if (allDb) return allDb;
  else throw new Error("Databases were not initialized");
}

function getMysqlConnection() {
  "use strict";
  const
    dbConfig = config.mysqlDB,
    Sequelize = require("sequelize"),
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig),

    modelsPath = config.modelsPath,
    db = { models: {} };

  fs
    .readdirSync(modelsPath)
    .filter( (file) => {
      return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach( (file) => {
      let model = sequelize.import(path.join(modelsPath, file));
      db.models[model.name] = model;
    });

  Object.keys(db.models).forEach( (modelName) => {
    if ("associate" in db.models[modelName]) {
      db.models[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  db.sync = syncMysql;

  initDao(db);
  initRelations(db);

  return db;
}

function initDao(db) {
  require('./userDao').init(db.models);
  require('./itemDao').init(db.models);
  /** Here init others DAO **/
}

function initRelations(db) {
  const User = db.models['user'];
  const Item = db.models['item'];

  if (User && Item) {
    Item.belongsTo(User, {foreignKey: "user_id"});
  }
}

async function createMysqlDatabases() {
  const
    dbConfig = config.mysqlDB,
    Sequelize = require("sequelize"),
    sequelize = new Sequelize("", dbConfig.username, dbConfig.password, dbConfig);

  let response = await sequelize.query(
    `CREATE DATABASE IF NOT EXISTS ${config.mysqlDB.database}`,
    { type: sequelize.QueryTypes.RAW }
    ).catch(e => {
    console.log("Mysql databases initialisation error: ", e);
  });

  await sequelize.close();
  return response;
}

function syncMysql() {
  this.sequelize.sync().then(function() {
    
    console.log('Nice! Database looks fine')
    
  }).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
  });
}

function syncAll() {
  Object.keys(allDb).forEach( (key) => {
    let db = allDb[key];
    if (db.sync) db.sync();
  });
}

module.exports.init = init;
module.exports.getAllDatabases = getAllDatabases;