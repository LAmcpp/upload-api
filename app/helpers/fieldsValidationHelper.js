const
  uuidValidator = require('uuid-validate');

function isValidID(id) {
  return id ? uuidValidator(id) : false;
}

function isValidEmail(email) {
  let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return  regex.test(email);
}

function isValidPassword(password) {
  return password && password.length > 4;
}

function isValidName(name) {
  let regex = /^[a-zA-Z ]{2,30}$/;
  return regex.test(name);
}

function isValidPhoneNumber(phone) {
  let regex = /(^\+?[0-9]{12})$/;
  return regex.test(phone);
}

module.exports.isValidID = isValidID;
module.exports.isValidEmail = isValidEmail;
module.exports.isValidPassword = isValidPassword;
module.exports.isValidName = isValidName;
module.exports.isValidPhoneNumber = isValidPhoneNumber;