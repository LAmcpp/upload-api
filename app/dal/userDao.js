const
  hashHelper = require('../helpers/hashHelper'),
  modelName = require('../constants').USER_TYPE,
  getAttributes = require('../helpers/daoHelper').getUserAttributes;

let User;

function init(models) {
  User = models[modelName];
}

async function create(data) {
  let hash = hashHelper.hashPassword(data.password);
  data = {
    name: data.name,
    email: data.email,
    password: hashHelper.getDatabasePasswordFromHash(hash),
    phone: data.phone
  };

  let newUser = await User.create(data);
  if (newUser) {
    newUser = newUser.dataValues;
    newUser.password = hash.hash;
  }
  return newUser;
}

function getByEmail(email, isValidation) {
  return getUser({email: email}, isValidation);
}

function getById(id, isValidation) {
  return getUser({id: id}, isValidation);
}

async function getUser(where, isValidation) {
  let user = await User.find({
    where: where,
    attributes: getAttributes(isValidation)
  });
  return user ? user.dataValues : user;
}

function search(params) {
  return User.findAll({
    where: params
  });
}

function update(id, options) {
  return User.update(options, { where: { id: id }} );
}

async function isExistsEmail(email) {
  const user = await getByEmail(email);
  return !!user;
}

module.exports.init = init;
module.exports.create = create;
module.exports.getByEmail = getByEmail;
module.exports.getById = getById;
module.exports.search = search;
module.exports.update = update;
module.exports.isExistsEmail = isExistsEmail;