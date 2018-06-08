const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
const util = require('./util.js');

var playerControllerFactory = require('./game/playerController.js');
var playerController = new playerControllerFactory();
var lobbyControllerFactory = require('./game/lobbyController.js');
var lobbyController = new lobbyControllerFactory(playerController);
var playerAPI = require('./api/api/playerAPI.js');
playerAPI(app, playerController); //not used now

const socketHandleFactory = require('./socket/socketHandler.js');

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', function connection(ws) {
  //const location = url.parse(ws.upgradeReq.url, true);
  var socketHandle = new socketHandleFactory(playerController, lobbyController, ws);

  ws.on('message', socketHandle.msgHandler);

});

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});