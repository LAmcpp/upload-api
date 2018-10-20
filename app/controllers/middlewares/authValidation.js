const
  jwt = require('jsonwebtoken'),
  jwtSecret = require('../../config/index').jwtSecret;

module.exports.tokenValidation = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'];
      let user = jwt.verify(authorization, jwtSecret);

      if (user.ip != req.ip) {
        return res.status(401).send();
      }

      req.body.id = user.id;

      return next();
    } catch (err) {
      return res.status(401).send();
    }
  } else {
    return res.status(422).send([{field: "token", message: "Missing auth token"}]);
  }
};