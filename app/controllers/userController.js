const
  userDao = require('../dal/userDao'),
  usersModelHelper = require('../helpers/userModelHelper');

async function getById (req, res) {
  try {
    let user = await userDao.getById(req.params.id);
    if (!user) res.status(404).send();
    res.send(usersModelHelper.fromModelToResponse(user));
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
    if (!users || !users.length) res.status(404).send();
    let data = usersModelHelper.fromModelToResponse(users);
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

async function updateUser(req, res) {
  let updateObject = {};
  if (req.body.phone) updateObject.phone = req.body.phone;
  if (req.body.name) updateObject.name = req.body.name;
  if (req.body.email) updateObject.email = req.body.email;
  if (req.body.password) updateObject.password = req.body.password;

  try {
    if (Object.keys(updateObject).length > 0) {
      let updated = await userDao.update(req.body.id, updateObject);
      if (!updated[0]) {
        res.status(422).send([{field: "error", message: "Update error"}]);
      }
    }

    let user = req.body.user ? req.body.user : await userDao.getById(req.body.id);

    res.send(usersModelHelper.fromModelToResponse(Object.assign(user, updateObject)));
  } catch(err) {
    logDatabaseError(err);
    res.status(422).send([{field: "error", message: "Update error"}]);
  }

  // let user = await userDao.getById(req.body.id);
  // if (!user) res.status(404).send();
  //
  // let oldPassword = req.body['current_password'];
  // if (oldPassword) {
  //   if (!validationHelper.passwordsEqual(oldPassword, user.password)){
  //     res.status(422).send([{field: "current_password", message: `Wrong current password`}]);
  //     return;
  //   }
  //
  //   let newPassword = req.body['new_password'];
  //   validationHelper.checkRequiredFields(
  //     {new_password: newPassword},
  //     validationHelper.errorCallback(res, 422)
  //   );
  //
  //   req.body.password = newPassword;
  // }
  //
  // let updateObject = validationHelper.deleteEmptyOptionalFields({
  //   phone: req.body.phone !== user.phone ? req.body.phone : "",
  //   email: req.body.email !== user.email ? req.body.email : "",
  //   name: req.body.name !== user.name ? req.body.name : "",
  //   password: req.body.password
  // });
  //
  // if (updateObject.email && updateObject.email !== user.email) {
  //   await userDataValidation.hasUnusedEmail(req, res, update(user, updateObject));
  // } else {
  //   if (updateObject.email) delete updateObject.email;
  //   update(user, updateObject)(req, res);
  // }
}

function update(user, updateObject) {
  // return async (req, res) => {
  //   if (Object.keys(updateObject).length > 0) {
  //     if (updateObject.oldPassword) delete updateObject.oldPassword;
  //     let updated = await userDao.update(user.id, updateObject);
  //     if (updated[0])
  //       res.send(usersModelHelper.fromModelToResponse(Object.assign(user, updateObject)));
  //     else
  //       res.status(422).send('User data not updated');
  //   } else {
  //     res.send(usersModelHelper.fromModelToResponse(user));
  //   }
  // };
}

function logDatabaseError(err) {
  let message = "Access database error";
  console.error(message);
  console.error(err.stack || err);
}

module.exports = {
  getById: getById,
  search: search,
  getCurrentUser: getCurrentUser,
  updateUser: updateUser
};