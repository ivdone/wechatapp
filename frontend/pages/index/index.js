//index.js

//获取应用实例
var app = getApp();
Page({
  data: {
    logo: "../../images/werewolf.jpg",
    title: "狼人杀"
  },
  onLoad: function () {
  },
  CreateLobby: function(e) {
    wx.navigateTo({
      url: "../CreateLobby/CreateLobby"
    });
  },
  JoinLobby: function(e) {
    // todo
    wx.navigateTo({
      url: "../CreateLobby/CreateLobby"
    });
  }
})