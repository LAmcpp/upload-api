const
  // crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  jwtSecret = require('../config/index').jwtSecret;

module.exports = {
  auth: (req, res) => {
    try {
      // let refreshId = req.body.id + jwtSecret;
      // let salt = crypto.randomBytes(16).toString('base64');
      // let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
      // req.body.refreshKey = salt;
      // let b = new Buffer(hash);
      // let refresh_token = b.toString('base64');
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