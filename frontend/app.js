var eventbus = require("js/EventBus.js");

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
    wx.login(function(){
      wx.getUserInfo({
        success: function (res) {
          this.globalData.userInfo = res.userInfo;
        }.bind(this),
        fail: function (error) {
          console.log("failed to get user info:" + error);
        }
      });
    });
    this.initSocket();

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
    gameNumber: 8,
    gameConfig: {},
    name: "todo",
    room: 1,
    userInfo: {
            nickName: "p1",
            avatarUrl: "", //todo
            gender: 0,
            province: "",
            city: "",
            country: ""
          }
  },
  initSocket: function () {
    wx.connectSocket({
      url: "ws://localhost:8080"
    });
    wx.onSocketOpen(function (res) {
      this.isSocketOpen = true;
      var initPlayer = {
        type: "userInfoInit",
        message: {
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