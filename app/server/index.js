const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/', require('../routes/index'));

app.listen(port, (err) => {
  if (err) return console.log("Server wasn't started", err)
  
  console.log(`Server started listening on port ${port}`);
});

module.exports = app;