// 引入promisify 进行异步处理
const promisify = require('./promisify.js');


// 需要使用的微信 API，转成返回 Promise 的接口
module.exports = {
  request: promisify(wx.request),
  login: promisify(wx.login),
  checkSession: promisify(wx.checkSession),
  getUserInfo: promisify(wx.getUserInfo),
  getSystemInfo: promisify(wx.getSystemInfo),
}
