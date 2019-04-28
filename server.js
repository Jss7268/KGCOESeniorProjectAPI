var express = require("express");
var routes = require("./routes/routes");
var cors = require('cors');
var bodyParser = require('body-parser')

require('dotenv').config();
const app = express();

var corsOptions = {
  origin: process.env.REDIRECT_FRONTEND_BASE,
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

routes(app);

app.get('/', function (req, res){
  return res.status(200).send({'message': 'YES you got this!!'});
});

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