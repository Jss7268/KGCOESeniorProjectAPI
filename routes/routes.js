const subdomain = require('express-subdomain');

module.exports = (app) => {
  // api.localhost.com:port/
  app.use(subdomain('api', require('./api.routes')));
  
  // localhost:port/api/
  app.use('/api', require('./api.routes'));
};