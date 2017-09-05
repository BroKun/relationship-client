const myWX = require('./lib/wx.js');
const co = require('./lib/co.js');
const { server, accountKey } = require('./constant');

function getOpenId(code) {
  return request({
    url: `${server}/user/token?code=${code}`,
  });
}
//app.js
App({
  onLaunch: () => {
    console.log('首次启动: app.onLaunch');
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },
  onShow: () => {
    console.log('进入程序: app.onShow');
  },
  onHide: () => {
    console.log('隐藏程序: app.onHide');
  },
  onError: () => {
    console.log('程序异常: app.onError');
  },
  confirmOnline: co.wrap(function* () {
    try {
      yield myWX.checkSession();
      if (!this.globalData.loginInfo) {
        throw new Error('session outdated');
      }
      return true;
    } catch (ex) {
      return yield this.login();
    }
  }),
  getUserInfo: co.wrap(function* () {
    var that = this
    if (this.globalData.userInfo) {
      return this.globalData.userInfo;
    }
    else {
      //调用登录接口
      const res = yield myWX.getUserInfo();
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
