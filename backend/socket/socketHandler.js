'use strict';
function socketHandler(playerController,lobbyController,ws)
{
  this.playerController = playerController;
  this.lobbyController = lobbyController;
  this.ws = ws;
  this.msgListenerDict = {};
  var that = this;

  var msgHandler = function (message) {

    var incomingMsg = JSON.parse(message);
    var msgType = incomingMsg.type;
    var msg = incomingMsg.message;
    console.log('received: %s', message);

    if (msgType === "createLobbyRequest") {
      console.log("createLobbyRequest :" + msg);
      var lobbyID = that.lobbyController.CreateLobby(msg.config, msg.playerID, that.ws);
      that.ws.send(JSON.stringify({type:"LobbyCreated", lobbyID : lobbyID}));
      return;
    }

    if (msgType === "userInfoInit") {
      that.playerController.setPlayerInfo(msg.openid, msg.nickName, msg.avatarUrl);
      return;
    }

    if (msgType === "LobbyPageLoaded") {
      var playerIDs = that.lobbyController.GetPlayers(msg.lobbyID);
      var players = playerIDs.map(function(player){ return that.playerController.getPlayerInfo(player.player)});
      console.log("send message : LobbyUpdated"  );
      that.ws.send(JSON.stringify({type:"LobbyUpdated", players: players}));
      return;

    }

    if (msgType === "JoinLobby") {
      var players = that.lobbyController.JoinLobby(msg.openid, msg.lobbyID, that.ws);
      that.ws.send(JSON.stringify({type:"LobbyJoined", lobbyID : lobbyID}));
      return;
    }

    if (msgType === "LeaveLobby") {
      var players = that.lobbyController.LeaveLobby(msg.openid, msg.lobbyID);
      that.ws.send(JSON.stringify({type:"LobbyLeaved", lobbyID : lobbyID}));
      return;
    }

    if (msgType === "KickPlayer") {
      var players = that.lobbyController.KickPlayer(msg.openid, msg.lobbyID);
      return;
    }


  }


  return {
    msgHandler: msgHandler
  }
}



module.exports = socketHandler;