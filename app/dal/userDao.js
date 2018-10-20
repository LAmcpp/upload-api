const hashHelper = require('../helpers/hashHelper');

let User;

function init(models) {
  User = models['user'];
}

async function create(data) {
  const hash = hashHelper.hashPassword(data.password);
  data = {
    name: data.name,
    email: data.email,
    password: hashHelper.getDatabasePasswordFromHash(hash),
    phone: data.phone
  };

  let newUser = (await User.create(data)).dataValues;
  newUser.password = hash.hash;
  return newUser;
}

async function getByEmail(email) {
  const user = await User.findOne({
    where: {
      email: email
    }
  });
  return user ? user.dataValues : user;
}

async function getById(id) {
  return (await User.findByPrimary(id)).dataValues;
}

async function search(params) {
  return await User.findAll({
    where: params
  });
}

async function update(id, fields) {
  let user = await User.update(fields, { where: { id: id }} );
  return user;
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