var eventbus = require("js/EventBus.js");
const backEndUrl = "localhost:8080";
//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        this.globalData.windowWidth = windowWidth;
        var windowHeight = res.windowHeight;
        this.globalData.windowHeight = windowHeight;
        var pxRatio = 750 / windowWidth;
        this.globalData.pxRatio = pxRatio;
        //窗口高度已经自动减去了导航栏高度(84rpx)
        console.log("(SystemInfo)" + "windowWidth: " + windowWidth + " windowHeight: " + windowHeight + " pxRatio: " + pxRatio);
      }.bind(this)
    });
    var that = this;
    wx.login({
      success: function(res){
        var decryptInfo = { wxcode: res.code };
        wx.getUserInfo({
          success: function (res) {
            decryptInfo.encryptedData = res.encryptedData;
            decryptInfo.iv = res.iv;
            that.sendGetRequest("/playerInfo/decryptUserInfo", decryptInfo, that.initApp, function(){});
          }.bind(this),
          fail: function (error) {
            console.log("failed to get user info:" + error);
          }
        });
      }
    });
    eventbus.addEventListener("locationUpdate", function (event, location) {
      var message = {
        name: this.globalData.name,
        room: this.globalData.room,
        x: location.x,
        y: location.y,
        w: location.w,
        h: location.h,
        column: location.column,
        row: location.row,
        index: location.index
      };
      sendSocketMessage("locationUpdate", message);
    }, this);
  },
  sendSocketMessage: function(msgType, message) {
    if (this.isSocketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify({
          "type": msgType,
          message: message
        })
      });
    }
    else {
      console.log("Error: trying to send Socket Message: " + message + ", but the connection is not opened");
    }
  }
  ,
  globalData: {
    userInfo: {
      "openId": "OPENID",
      "nickName": "NICKNAME",
      "gender": "M",
      "city": "CITY",
      "province": "PROVINCE",
      "country": "COUNTRY",
      "avatarUrl": "AVATARURL",
      "unionId": "UNIONID",
      watermark: {
        appid: "appid",
      }
    }
  },
  sendGetRequest: function(api, params, callback, failure) {
    wx.request({
      url: 'http://' + backEndUrl + api,
      method: "GET",
      data: params,
      success: function(res) {
        callback(res);
      },
      fail: function (res) {
        failure();
      }
    })
  },
  sendPostRequest: function (api, params, callback, failure) {
    wx.request({
      url: 'https://' + backEndUrl + api,
      method: "GET",
      data: params,
      success: function (res) {
        callback(res);
      },
      fail: function(res) {
        failure(res);
      }
    })
  },
  initApp: function (res) {
    this.globalData.userInfo = res;
    wx.connectSocket({
      url: "ws://" + backEndUrl
    });
    wx.onSocketOpen(function (res) {
      this.isSocketOpen = true;
      var initPlayer = {
        type: "userInfoInit",
        message: {
          openid: this.globalData.userInfo.watermark.openId,
          nickName: this.globalData.userInfo.nickName,
          avatarUrl: this.globalData.userInfo.avatarUrl
        }
      };
      wx.sendSocketMessage({
        data: JSON.stringify(initPlayer)
      });
    }.bind(this));
    wx.onSocketMessage(function (res) {
      var data = JSON.parse(res.data);
      var type = data.type;
      eventbus.dispatch(type, this, data);
    }.bind(this));
    wx.onSocketError(function (res) {
      this.isSocketOpen = false;
    }.bind(this));
    wx.onSocketClose(function (res) {
      this.isSocketOpen = false;
    }.bind(this));
  }
})