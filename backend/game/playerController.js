'use strict';

function playerInfo(name, avatarUrl, openid) {
  this.name = name;
  this.avatarUrl = avatarUrl;
  this.openid = openid
}
function playerControllerFactory()
{
	var playersMap = {};
	const defaultAvatarUrl = "http://some.com";

	var getPlayerInfo = function (playerID) 
	{
		console.log("getPlayerInfo() for player :" + playerID);
		if (playerID === undefined || playerID === "")
		{
			console.log("unknown player ID");
			var newID = generateErrorID();
			playerID = newID;
			var name = generateErrorName();
			playersMap[playerID] = new playerInfo(name, defaultAvatarUrl, playerID);
		}  
		return playersMap[playerID];
	}

	var setPlayerInfo = function (playerID, name, avatarUrl) 
	{
		console.log("setPlayerInfo() for player :" + playerID);
		if (playersMap[playerID] != undefined) return true;
		try {
			playersMap[playerID] = new playerInfo(name, avatarUrl, playerID);
		} catch(e) {
			console.log("error in setPlayerInfo");
			return false;
		}
		return true;
	}

	var getPlayerLobbyInfo = function (req, res) 
	{
		try {
			const playerID = req.params.playerID;
			res.send(JSON.stringify(playersMap[playerID]));
		} catch(e) {
			console.log("error in setPlayerInfo");
		}
	}

	var setPlayerLobbyInfo = function (req, res) 
	{
		try {
			const playerID = req.params.playerID;
			playersMap[playerID] = new playerInfo(name, req.params.avatarUrl, req.params.playerID);
			res.send(JSON.stringify(playersMap[playerID]));
		} catch(e) {
			console.log("error in setPlayerInfo");
		}
	}
	return {
		getPlayerInfo: getPlayerInfo,
		setPlayerInfo: setPlayerInfo,
		getPlayerLobbyInfo: getPlayerLobbyInfo,
		setPlayerLobbyInfo: setPlayerLobbyInfo
	}
}

function generateErrorID() {
	return randomGenerator++;
}
function generateErrorName() {
	return "user not found";
}


module.exports = playerControllerFactory