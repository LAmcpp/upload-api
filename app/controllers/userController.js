const
  userDao = require('../dal/userDao'),
  modelHelper = require('../helpers/modelsHelper'),
  logDatabaseError = require('../helpers/controllersHelper').logDatabaseError;

async function getById (req, res) {
  try {
    let user = await userDao.getById(req.params.id);
    if (!user) res.status(404).send();
    res.send(modelHelper.fromModelToResponse(user, modelHelper.userConvertForResponse));
  } catch (err) {
    logDatabaseError(err);
    res.status(404).send();
  }
}

async function search(req, res) {
  try {
    const queryParams = {};
    if (req.query.email) queryParams.email = req.query.email;
    if (req.query.name) queryParams.name = req.query.name;
    const users = await userDao.search(queryParams);
    if (!users || !users.length) return res.status(404).send();
    let data = modelHelper.fromModelToResponse(users, modelHelper.userConvertForResponse);
    res.send(data);
  } catch (err) {
    logDatabaseError(err);
    res.status(404).send();
  }
}

async function getCurrentUser(req, res) {
  req.params = {
    id: req.body.id
  };
  await getById(req, res);
}

async function update(req, res) {
  let updateObject = {};
  if (req.body.phone) updateObject.phone = req.body.phone;
  if (req.body.name) updateObject.name = req.body.name;
  if (req.body.email) updateObject.email = req.body.email;
  if (req.body.password) updateObject.password = req.body.password;

  try {
    if (Object.keys(updateObject).length > 0) {
      let updated = await userDao.update(req.body.id, updateObject);
      if (!updated[0]) {
        return res.status(422).send([{field: "error", message: "Update error"}]);
      }
    }

    let user;
    if (req.body.user) {
      if (updateObject.password) delete updateObject.password;
      user = Object.assign(req.body.user, updateObject);
    } else {
      user = await userDao.getById(req.body.id);
    }

    res.send(user);
  } catch(err) {
    logDatabaseError(err);
    res.status(422).send([{field: "error", message: "Update error"}]);
  }
}

module.exports = {
  getById: getById,
  search: search,
  getCurrentUser: getCurrentUser,
  update: update
};