const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  fileUpload = require('express-fileupload'),
  config = require('../config');

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload({
  createParentPath: true
}));

app.use('/api/', require('../routes/index'));

app.listen(config.port, (err) => {
  if (err) return console.log("Server wasn't started", err)
  
  console.log(`Server started listening on port ${config.port}`);
});

module.exports = app;