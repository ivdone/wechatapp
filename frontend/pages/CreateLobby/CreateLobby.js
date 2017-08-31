// CreateLobby.js
var roles = require("../../js/roles.js");
var configs = require("../../js/configs.js");
var eventbus = require("../../js/EventBus.js");

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemArray: [0, 1, 2, 3, 4, 5, 6, 7],
    array: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    index: 0,
    config: configs[8],
    totalCount: 8
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.gameNumber = 8;
    app.globalData.gameConfig = configs[8];
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  roleNumberChange: function (e){
    var index = e.detail.value;
    var id = e.target.id;
    var newConfig = this.data.config;
    newConfig[parseInt(id)].count = parseInt(index);
    console.log(newConfig);
    var newTotalCount = newConfig.reduce(function(acc, cur) {
      return acc + cur.count;
    }, 0);
    this.setData({
      config: newConfig,
      totalCount: newTotalCount
    });
  },
  gameNumberChange: function (e) {
    var index = e.detail.value;
    var array = this.data.array;
    var gamerCount = array[index];
    this.setData({
      config: configs[gamerCount],
      itemArray: Array.from(Array(gamerCount).keys())
    });
  },
  CreateLobbyRequest: function (e) {
    var index = this.data.index;
    var array = this.data.array;
    var number = array[index];
    var config = this.data.config;
    wx.showLoading({
      title: '正在创建房间',
    });
    
    eventbus.addEventListener("LobbyCreated", function (scope, lobbyInfo) {
      wx.hideLoading();
      wx.navigateTo({
        url: "../Lobby/Lobby"
      });
    }, this);

    app.sendSocketMessage("createLobbyRequest",
      { config : config.map((role) => {
          return {count:role.count, roleId:role.role.name};
        }),
        totalCount: totalCount
      }
    );
  }
})