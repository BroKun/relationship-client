//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello -----  World',
    userInfo: {}
  },
  bindTest: function(){
    wx.request({
      url: 'https://dreamtecher.brokun.cn/api/v1/test/123', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('进入页面index:onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo().then(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
  },
  onShow: function () {
    console.log('进入页面index:onShow')
  }
})
