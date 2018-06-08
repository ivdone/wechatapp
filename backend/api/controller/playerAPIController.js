'use strict';
var controller_ = null;
var util = require("./../../util.js");



exports.setPlayerController = function(controller) 
{
	controller_ = controller;
}

exports.decodeUserInfo = function (req, res) 
{
	console.log("decodingUserInfo");
	util.getSessionKey(req.query.wxcode, 
		function (error, data) {
			var result = util.decrypt(data.session_key, req.query.encryptedData, req.query.iv);
			res.send(result);
		}
	);
}

exports.getPlayerInfo = function (req, res) 
{
	console.log("getPlayerInfo()");
	var result = controller_.getPlayerInfo(req.params.playerID);
	if (result !== undefined)
	{
		res.send(JSON.stringify(playersMap[playerID]));
		return;
	}
	res.sendStatus(400);
}

exports.setPlayerInfo = function (req, res) 
{
	try {
		const player = req.params;
		var success = controller_.setPlayerInfo(player.playerID, player.name, player.avatarUrl);
		res.sendStatus(success ? 200 : 400);
	} catch(e) {
		console.log("error in setPlayerInfo");
	}
}

exports.getPlayerLobbyInfo = function (req, res) 
{
	try {
		const playerID = req.params.playerID;
		playersMap[playerID] = new playerInfo(name, req.params.avatarUrl);
		res.send(JSON.stringify(playersMap[playerID]));
	} catch(e) {
		console.log("error in setPlayerInfo");
	}
}

exports.setPlayerLobbyInfo = function (req, res) 
{
	try {
		const playerID = req.params.playerID;
		playersMap[playerID] = new playerInfo(name, req.params.avatarUrl);
		res.send(JSON.stringify(playersMap[playerID]));
	} catch(e) {
		console.log("error in setPlayerInfo");
	}
}