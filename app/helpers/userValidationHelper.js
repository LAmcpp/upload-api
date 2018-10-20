const
  fieldsHelper = require('./fieldsValidationHelper'),
  hashHelper = require('./hashHelper');

function loginValidation(data) {
  const errors = [];
  emailValidation(data.email, errors);
  passwordValidation(data.password, errors);
  return errors;
}

function registrationValidation(data) {
  const errors = loginValidation(data);
  nameValidation(data.name, errors);
  phoneValidation(data.phone, errors);
  return errors;
}

function passwordsEqual(fromReq, fromDb) {
  let passwordFields = fromDb.split('$');
  let salt = passwordFields[0];
  let hash = hashHelper.hashPassword(fromReq, salt).hash;
  return hash === passwordFields[1];
}

function getByIdValidation(id) {
  return idValidation(id);
}

function searchValidation(data) {
  const errors = [];
  if (data.email) emailValidation(data.email, errors);
  if (data.name) nameValidation(data.name, errors);
  return errors;
}

function updateValidation(data) {
  const errors = searchValidation(data);
  if (data.phone) phoneValidation(data.phone, errors);
  return errors;
}

function idValidation(id, errors) {
  errors = errors ? errors : [];
  if (!fieldsHelper.isValidID(id))
    errors.push({field: "id", message: "Invalid id"});
  return errors;
}
function emailValidation(email, errors) {
  errors = errors ? errors : [];
  if (!fieldsHelper.isValidEmail(email))
    errors.push({field: "email", message: "Invalid email"});
  return errors;
}
function passwordValidation(password, errors) {
  errors = errors ? errors : [];
  if (!fieldsHelper.isValidPassword(password))
    errors.push({field: "password", message: "Password should contain at least 5 characters"});
  return errors;
}
function nameValidation(name, errors) {
  errors = errors ? errors : [];
  if (!fieldsHelper.isValidName(name) ) {
    errors.push({field: "name", message: "Invalid name"});
  }
  return errors;
}
function phoneValidation(phone, errors) {
  errors = errors ? errors : [];
  if (phone && !fieldsHelper.isValidPhoneNumber(phone)) {
    errors.push({field: "name", message: "Invalid phone number"});
  }
  return errors;
}

module.exports.loginValidation = loginValidation;
module.exports.registrationValidation = registrationValidation;
module.exports.searchValidation = searchValidation;
module.exports.getByIdValidation = getByIdValidation;
module.exports.passwordsEqual = passwordsEqual;
module.exports.updateValidation = updateValidation;
module.exports.passwordValidation = passwordValidation;