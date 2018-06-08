'use strict';

function getNewLobbyID ()
{
	//TODO
	return 1;
}

function LobbyInfo(config, owner) {
	var players = [];
	var config = config;
	var lobbyID = getNewLobbyID();
	var owner = owner;
	var that = this;
	function SetOwner(player, ws)
	{
		owner = player.openid;
		players.push( {player: player, ws:ws} );
	}
	function JoinLobby(player, ws) {
		if (players.length < config.totalCount)
		{
			players.push( {player:player, ws:ws} );
			return true;
		}
		return false;
	}
	function LeaveLobby(player) {
		//todo
	}
	function KickPlayer(player) {

	}
	function GetPlayers() {
		console.log(players);
		return players;
	}

	return {
		SetOwner: SetOwner,
		JoinLobby: JoinLobby,
		LeaveLobby: LeaveLobby,
		KickPlayer: KickPlayer,
		GetPlayers: GetPlayers
	}
}

function LobbyController(playerController)
{
	this.LobbyContainer = {};
	var that = this;
	return {
		CreateLobby : function (config, playerID, ws) {
			var newLobby = new LobbyInfo(config, playerID);
			that.LobbyContainer[newLobby.lobbyID] = newLobby;
			newLobby.SetOwner(playerID, ws);
			return newLobby.lobbyID;
		},

		JoinLobby : function (playerID, lobbyID, ws) {
			return that.LobbyContainer[lobbyID].JoinLobby(playerID);
		},

        LeaveLobby : function (playerID, lobbyID) {
			return that.LobbyContainer[lobbyID].Leave(playerID);
		},

        KickPlayer : function (playerID, lobbyID) {
			return that.LobbyContainer[lobbyID].KickPlayer(playerID);
		},

		GetPlayers : function(lobbyID) {
			return that.LobbyContainer[lobbyID].GetPlayers();
		}
	}
}

module.exports = LobbyController;