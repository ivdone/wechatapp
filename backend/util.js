const WXBizDataCrypt = require("./WXBizDataCrypt.js");
const Request = require('request')

const APP_SECRET = "11ea3b8a65c529bfff5df20c46987fdb";
const APP_ID = "wx5493cb32f18b6cca";

const pc = new WXBizDataCrypt(APP_ID)


exports.getSessionKey = function (code, callback) {
	const url = 'https://api.weixin.qq.com/sns/jscode2session?appid='
	+APP_ID+'&secret='+APP_SECRET+'&js_code='+code
	+'&grant_type=authorization_code';
	console.log("request sesson key from url" + url);
	Request(url, (error, response, body) => {
		console.log(body);
		if(!error && response.statusCode == 200){
			console.log('getSessionKey:', body, typeof(body))

			const data =JSON.parse(body)
			if(!data.session_key){
				callback({
					code: 1, 
					message: data.errmsg
				})
				return
			}
			callback(null, data)
		}else{
			callback({
				code: 1, 
				message: error
			})
		}
	});
}

// 解密
exports.decrypt = function(sessionKey, encryptedData, iv) {
	try{
		const data = pc.decryptData(sessionKey, encryptedData , iv)
		console.log('decrypted:', data)
		return data;
	}catch(e){
		console.log(e)	
		return {};
	}
}

exports.getNewLobbyID = function() {
	//todo
}
