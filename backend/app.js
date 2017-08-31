const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
const util = require('./util.js');
var playerController = require('./game/playerController.js');

var playerAPI = require('./api/api/playerAPI.js');
playerAPI(app, playerController); //not used now

const socketHandle = require('./socket/socketHandler.js');

socketHandle.setPlayerController(playerController);

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('message', socketHandle.msgHandler);

});

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});