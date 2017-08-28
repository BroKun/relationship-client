// 引入promisify 进行异步处理
const promisify = require('./promisify.js');
function request(options, ...params) {
  return (options, ...params) => {
    const token = wx.getStorageSync('userInfo');
    if(!token) return wx.request(options, ...params);
    const userInfo = JSON.parse(token);
    if(userInfo && userInfo.token){
      options.header = Object.assign({
        'Autorization': `bearer ${userInfo.token}`,
      },options.header||{})
      wx.request(options, ...params,)
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
