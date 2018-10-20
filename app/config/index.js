const
  crypto = require('crypto'),
  path = require('path');

const
  env = process.env.NODE_ENV || 'dev',
  envConfig = require('./config')[env];

module.exports = {
  mysqlDB: envConfig['mysql'],
  jwtSecret: crypto.randomBytes(16).toString('base64'),
  modelsPath: path.join(__dirname, '..', 'models')
};