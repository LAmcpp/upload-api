const
  userDao = require('../../dal/userDao'),
  validationHelper = require('../../helpers/userValidationHelper'),
  hashHelper = require('../../helpers/hashHelper'),
  errorsCode = 422;

async function login(req, res, next) {
  const
    email = req.body.email,
    password = req.body.password;

  let errors = validationHelper.loginValidation({email: email, password: password});
  if (errors.length) {
    return res.status(errorsCode).send(errors);
  }

  let user;
  try {
    user = await userDao.getByEmail(email);
    if (!user) {
      errors.push({field: "email", message: "Wrong email"});
    } else if ( !validationHelper.passwordsEqual(password, user.password) ) {
      errors.push({field: "password", message: "Wrong password"});
    }
  } catch (err) {
    let message = "Login error";
    console.error(message);
    console.error(err.stack || err);
    return res.status(errorsCode).send([{field: "error", message: message}]);
  }

  if(errors.length) {
    return res.status(errorsCode).send(errors);
  }

  req.body = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone
  };
  return next();
}

async function registration(req, res, next) {
  let errors = validationHelper.registrationValidation({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone
  });
  if (errors.length) {
    return res.status(errorsCode).send(errors);
  }
  return next();
}

async function search(req, res, next) {
  let errors = validationHelper.searchValidation({
    email: req.query.email,
    name: req.query.name
  });
  if (errors.length)
    return res.status(errorsCode).send(errors);

  return next();
}

async function getById(req, res, next) {
  let errors = validationHelper.getByIdValidation(req.params.id);
  if (errors.length) {
    return res.status(errorsCode).send(errors);
  }

  return next();
}

async function update(req, res, next) {
  let errors = validationHelper.updateValidation({
    phone: req.body.phone,
    email: req.body.email,
    name: req.body.name
  });
  if (errors.length) {
    return res.status(errorsCode).send(errors);
  }

  try {
    let user;
    let oldPassword = req.body['current_password'];
    let newPassword = req.body['new_password'];

    if (oldPassword) {
      errors = validationHelper.passwordValidation(newPassword);
      if (errors.length) {
        return res.status(errorsCode).send([{field:"new_password", message: errors[0].message}]);
      }

      user = await userDao.getById(req.body.id);
      if (!user) return res.status(404).send();
      if ( !validationHelper.passwordsEqual(oldPassword, user.password) ) {
        return res.status(errorsCode).send([{field:"current_password", message: "Wrong current password"}]);
      }

      delete req.body['current_password'];
      delete req.body['new_password'];
      let hash = hashHelper.hashPassword(newPassword);
      req.body.password = hashHelper.getDatabasePasswordFromHash(hash);
      req.body.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      };
    } else if (newPassword) {
      return res.status(errorsCode).send([{field: "current_password", message: "Wrong current password"}]);
    }

    if (req.body.email) {
      if (!user) {
        user = await userDao.getById(req.body.id);
        req.body.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        };
      }
      if (req.body.email !== user.email) {
        return hasUnusedEmail(req, res, next);
      }
    }
  } catch (err) {
    let message = "Update error";
    console.error(message);
    console.error(err.stack || err);
    return res.status(errorsCode).send([{field: "error", message: message}]);
  }

  return next();
}

async function hasUnusedEmail(req, res, next) {
  try{
    let emailExist = await userDao.isExistsEmail(req.body.email);
    if (emailExist) {
      return res.status(errorsCode).send([{field: "email", message: `Email ${req.body.email} is already in use`}]);
    }
  } catch (err) {
    let message = "Access database error";
    console.error(message);
    console.error(err.stack || err);
    return res.status(errorsCode).send([{field: "error", message: message}]);
  }
  return next();
}

module.exports.login = login;
module.exports.registration = registration;
module.exports.hasUnusedEmail = hasUnusedEmail;
module.exports.search = search;
module.exports.getById = getById;
module.exports.update = update;