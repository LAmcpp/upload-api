const userDao = require('../../dal/userDao');

module.exports = async (req, res, next) => {
  try {
    let newUser = await userDao.create(req.body);
    req.body = {
      id: newUser.id,
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
      phone: newUser.phone
    };
    return next();
  } catch (err) {
    let message = "Registration error";
    console.error(message);
    console.error(err.track || err);
    res.status(422).send([{error: message}]);
  }
};