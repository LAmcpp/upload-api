const
  userDao = require('../dal/userDao'),
  validationHelper = require('../helpers/userValidationHelper'),
  modelHelper = require('../helpers/userModelHelper');

async function getById(id) {
  let code = 200, message;
  try {
    let user = await userDao.getById(id);
    if (!user) code = 404;
    else message = modelHelper.fromModelToResponse(user);
  } catch (err) {
    console.error(err.stack || err);
    return {code: 404};
  }
  return {code: code, message: message};
}

async function getByEmail(email) {
  let code = 200, message;
  try {
    let user = await userDao.getByEmail(email);
    if (!user) code = 404;
    else message = modelHelper.fromModelToResponse(user);
  } catch (err) {
    console.error(err.stack || err);
    return {code: 404};
  }
  return {code: code, message: message};
}

async function search(query) {
  let code = 200, message;

  // let queryParams = validationHelper.deleteEmptyOptionalFields({name: query.name, email: query.email});
  // let errors = queryParams ? validationHelper.searchValidation(queryParams) : null;
  // if (errors && errors.length) {
  //   return {code: 422, message: errors};
  // }

  try {
    let users = await userDao.search({name: query.name, email: query.email});
    if (!users || !users.length) code =  404;
    else message = modelHelper.fromModelToResponse(users);
  } catch (err) {
    console.error(err.stack || err);
    return {code: 404};
  }
  return {code: code, message: message};
}

async function updateUser() {
  // let code = 200, message;
  //
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
  return async (req, res) => {
    if (Object.keys(updateObject).length > 0) {
      if (updateObject.oldPassword) delete updateObject.oldPassword;
      let updated = await userDao.update(user.id, updateObject);
      if (updated[0])
        res.send(usersModelHelper.fromModelToResponse(Object.assign(user, updateObject)));
      else
        res.status(422).send('User data not updated');
    } else {
      res.send(usersModelHelper.fromModelToResponse(user));
    }
  };
}


module.exports.getById = getById;
module.exports.search = search;
module.exports.update = updateUser;