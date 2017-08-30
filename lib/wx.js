// 引入promisify 进行异步处理
const promisify = require('./promisify.js');
const { accountKey } = require('./constant');

function request(options, ...params) {
  return (options, ...params) => {
    const accountInfo = wx.getStorageSync(accountKey);
    if(!accountInfo) return wx.request(options, ...params);
    if(accountInfo && accountInfo.token){
      options.header = Object.assign({
        'Autorization': `Bearer ${accountInfo.token}`,
      },options.header||{});
      return wx.request(options, ...params);
    }
  }
}

// 需要使用的微信 API，转成返回 Promise 的接口
module.exports = {
  request: promisify(request),
  login: promisify(wx.login),
  checkSession: promisify(wx.checkSession),
  getUserInfo: promisify(wx.getUserInfo),
  getSystemInfo: promisify(wx.getSystemInfo),
}
