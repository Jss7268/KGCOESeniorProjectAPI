var express = require("express");
var routes = require("./routes/routes");
require('dotenv').config();
const app = express();

routes(app);

app.listen(8000);

if (process.env.USE_HTTPS) {
  const https = require("https"),
    fs = require("fs");
  const options = {
    key: fs.readFileSync(process.env.SSL_PRIVATE_KEY),
    cert: fs.readFileSync(process.env.SSL_PUBLIC_KEY)
  };
  https.createServer(options, app).listen(process.env.PORT);
} else {
  const http = require('http');
  http.createServer(app).listen(process.env.PORT);
}
console.log('Server started on port ' + process.env.PORT);