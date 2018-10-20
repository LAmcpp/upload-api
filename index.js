//Load environment
require('dotenv').load();

require('./app/dal').init().then( () => {
  require('./app/server');
});