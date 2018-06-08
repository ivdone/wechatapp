'use strict';
module.exports = function(app, playerAPIController) {
  var playerAPIController = require('../controller/playerAPIController.js');
  playerAPIController.setPlayerController(playerAPIController);
  

  app.route('/playerInfo')
    .get(playerAPIController.getPlayerInfo)
    .post(playerAPIController.setPlayerInfo);

  app.route('/playerInfo/lobbyInfo')
  	.get(playerAPIController.getPlayerLobbyInfo)
  	.post(playerAPIController.setPlayerLobbyInfo);

  app.route('/playerInfo/decryptUserInfo')
  	.get(playerAPIController.decodeUserInfo);
};