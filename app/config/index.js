const
  crypto = require('crypto'),
  path = require('path');

const
  env = process.env.NODE_ENV || 'dev',
  envConfig = require('./config')[env];

module.exports = {
  host: envConfig['host'],
  port: envConfig['port'],
  hostName: envConfig['host_name'],
  mysqlDB: envConfig['mysql'],
  jwtSecret: crypto.randomBytes(16).toString('base64'),
  modelsPath: path.join(__dirname, '..', 'models'),
  uploadOptions: {
    dirName: 'images',
    destination: path.join(__dirname, '..', '..', 'images').toString(),
    fieldName: 'file',
    filePrefix: 'itemImage',
    maxFileSize: 512000 //in bytes
  }
};