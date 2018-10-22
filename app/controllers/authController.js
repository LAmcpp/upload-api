const
  jwt = require('jsonwebtoken'),
  jwtSecret = require('../config/index').jwtSecret;

module.exports = {
  auth: (req, res) => {
    try {
      req.body.ip = req.ip;
      let token = jwt.sign(req.body, jwtSecret);
      res.status(200).send({token: token});
    } catch (err) {
      let message = "Token creating error";
      console.error(message);
      console.error(err.track || err);
      res.status(422).send([{field: "error", message: message}]);
    }
  }
};