const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
const util = require('./util.js');

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function playerInfo(name, avatarUrl, isHost) {
  this.name = name;
  this.avatarUrl = avatarUrl;
  this.isHost = isHost;
}

var playersMap = {};

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  var lobbyID = -1;
  var playerId = -1;
  var player = null;
  ws.on('message', function incoming(message) {
    incomingMsg = JSON.parse(message);
    msgType = incomingMsg.type;
    msg = incomingMsg.message;
    if (msgType == "createLobbyRequest") {
      console.log(this.player);
      //lobbyID = util.getNewLobbyID();
      lobbyID = 1;
      playersMap[this.lobbyID] = [this.player];
      this.playerId = 0;
      ws.send(JSON.stringify({type:"LobbyCreated"}));
    }
    if (msgType == "userInfoInit") {
      this.player = new playerInfo(msg.nickName, msg.avatarUrl, true);
    }
    if (msgType == "InitPlayersInfo") {
      console.log(playersMap[this.lobbyID]);
      ws.send(JSON.stringify({type:"PlayersInfo", lobbyID : this.lobbyID, players: playersMap[this.lobbyID], playerId: this.playerId}));
    }

    console.log('received: %s', message);
    //ws.send("ACK");
  });

});

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});