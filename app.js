const { checkSession, login, getUserInfo } = require('./lib/wx.js');
const co = require('./lib/co.js');
//app.js
App({
  onLaunch: co.wrap(function* () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    const token = wx.getStorageSync('logs');
    if (!token) {
      const loginRes = yield login();
      if (loginRes.code) {
        // TODO: request code 转化为用户信息，获取并保存token
      } else {
        // TODO: 无法正确的进行首次登录
      }
    }
  }),

  getUserInfo: co.wrap(function* () {
    var that = this
    if (this.globalData.userInfo) {
      return this.globalData.userInfo;
    } else {
      //调用登录接口
      const res = yield getUserInfo({ withCredentials: true });
      that.globalData.userInfo = res.userInfo;
      return this.globalData.userInfo;
    }
  }),

  globalData: {
    userInfo: null
  }
})
