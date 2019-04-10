var express = require("express");
const https = require("https"),
  fs = require("fs");

const db = require('./config/db.js');
const morgan = require('morgan');

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/kgcoe-st-project.se.rit.edu/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/kgcoe-st-project.se.rit.edu/fullchain.pem")
};

var routes = require("./routes/routes");
var cors = require('cors');
var bodyParser = require('body-parser')

require('dotenv').config();
const app = express();
app.use(morgan('dev'));
//app.use(morgan);

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.get('/', function (req, res){
  return res.status(200).send({'message': 'YES you got this!!'});
});

router.get('/getexperiments', db.getExperiments);

router.get('/getexperimentdata/:id', db.getExperimentDataById);

router.post('/createexperiment', db.createexperiment);

app.use('/api', router);

app.get('/',() => {
  var err = {};
  err.message = 'Not found'
  err.status = 404;
  next(err)
});

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


app.get('/api',function (){
  var err = {};
  err.message = 'Not found'
  err.status = 404;
  next(err)
})

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

//todo: why doesn't this work?
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

// app.use((error, req, res, next), function() {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });

//start server
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
