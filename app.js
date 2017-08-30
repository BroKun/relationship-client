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
  onLaunch: co.wrap(function* () {
    console.log('首次启动');
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    try {
      const loginRes = yield login();
      if (loginRes.code) {
        const infos = yield getOpenId(loginRes.code);
        wx.setStorageSync(accountKey, infos);
        Object.assign(this.globalData, infos);
      } else {
        throw new Error('login failed');
      }
    }
    catch(ex){
      // TODO: 给出无法登陆的错误页
    }
  }),
  onShow: () => {
    console.log('进入程序');
  },
  onHide: () => {
    console.log('隐藏程序');
  },
  onError: () => {
    console.log('程序异常');
  },
  getUserInfo: co.wrap(function* () {
    var that = this
    if (this.globalData.userInfo) {
      return this.globalData.userInfo;
    } else {
      const accountInfo = wx.getStorageSync(accountKey);
      try {
        if (!accountInfo) {
          yield checkSession();
          const loginRes = yield login();
          if (loginRes.code) {
            const infos = yield getOpenId(loginRes.code);
            wx.setStorageSync(accountKey, infos);
            Object.assign(this.globalData, infos);
          } else {
            throw new Error('login failed');
          }
        } else {
          Object.assign(this.globalData, accountInfo);
        }
      } catch (ex) {
        // TODO: 给出无法登陆的错误页
      }
      //调用登录接口
      const res = yield getUserInfo({ withCredentials: true });
      that.globalData.userInfo = res.userInfo;
      return this.globalData.userInfo;
    }
  }),

  globalData: {
    userInfo: null,
    openid: null,
    unionid: null,
    token: null,
  }
})
