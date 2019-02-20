var express = require("express");
const https = require("https"),
  fs = require("fs");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/kgcoe-st-project.se.rit.edu/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/kgcoe-st-project.se.rit.edu/fullchain.pem")
};

const app = express();

app.use((req, res) => {
  res.writeHead(200);
  res.end("hello world\n");
});

app.listen(8000);

https.createServer(options, app).listen(8080);
