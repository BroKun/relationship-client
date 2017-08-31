const { request, checkSession, login, getUserInfo } = require('./lib/wx.js');
const co = require('./lib/co.js');
const { server, accountKey } = require('./constant');

function getOpenId(code) {
  return request({
    url: `${server}/user/token?code=${code}`,
  });
}
//app.js
App({
  onLaunch: function () {
    console.log('首次启动');
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },
  onShow: () => {
    console.log('进入程序');
  },
  onHide: () => {
    console.log('隐藏程序');
  },
  onError: () => {
    console.log('程序异常');
  },
  confirmBaseInfo: co.wrap(function* () {
    try {
      yield checkSession();
      if (!this.globalData.loginInfo) {
        throw new Error('session outdated');
      }
      return true;
    } catch (ex) {
      return yield login();
    }
  }),
  getUserInfo: co.wrap(function* () {
    var that = this
    if (this.globalData.userInfo) {
      return this.globalData.userInfo;
    }
    else {
      //调用登录接口
      const res = yield getUserInfo();
      that.globalData.userInfo = res.userInfo;
      return this.globalData.userInfo;
    }
  }),
  login: co.wrap(function* () {
    try {
      const loginRes = yield login();
      if (loginRes.code) {
        const infos = yield getOpenId(loginRes.code);
        wx.setStorageSync(accountKey, infos);
        this.globalData.loginInfo = infos;
        return true;
      } else {
        throw new Error('login failed');
      }
    }
    catch (ex) {
      return false;
    }
  }),
  globalData: {
    userInfo: null,
    loginInfo: null,
  }
})
