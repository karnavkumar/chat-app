const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config');
const path = require('path');
const cors = require('cors');
const socket = require("socket.io");
const SocketClass = require('./socket')
const jwt = require('jsonwebtoken')
const app = express();
app.use(bodyParser.json({ limit: '250mb' }));
app.use(bodyParser.urlencoded({ limit: '250mb', extended: true }));
app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use((request, response, next) => {
  const nonValidatorPath = [
    'login',
    'register'
  ];
  console.log(request.url);

  let url = '';
  if (isNaN(request.url.substr(request.url.lastIndexOf("/") + 1).split("?")[0])) {
    url = request.url.substr(request.url.lastIndexOf("/") + 1).split("?")[0]
  } else {
    url = request.url.split('/')[2]
  }
  console.log("route", url);
  if (
    request.url !== "/" &&
    nonValidatorPath.indexOf(url) === -1
  ) {
    if (!request.headers.authorization) {
      return response.status(401).json({
        message: "unauthorise"
      });
    }
    jwt.verify(request.headers.authorization.replace('Bearer ', ''), 'darshana@1', function (err, decoded) {
      if (err) {
        return response.sendStatus(401)
      }
      next()
    })
  } else {
    next();
  }
});

app.use((req, res, next) => {
  console.log("qqqqq", req.url);
  next()
})

// app.use("/", (req, res) => res.render(require('./../client/build/index.html')))

app.use("/server", require('./routes')())
app.use((req, res) => {
  //   var err = new Error('Not Found');
  res.sendStatus(404);
});
app.use(
  express.static(path.resolve(__dirname, '..', 'build'), { maxAge: '30d' })
)

var http = require('http').createServer(app);

const io = socket(http, {
  pingInterval: 10000,
  pingTimeout: 60000,
});
SocketClass.initialise(io);

http.listen(PORT, function () {
  console.info('[listen] server listening at port %d', PORT);
});

process.on('uncaughtException', (err) => {
  console.info('[uncaughtException] %s', err.stack);
});