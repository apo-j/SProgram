const host = 'https://api.it120.cc/mall/';
const app = getApp();

const wxRequest = (params, url) => {
    wx.showToast({
        title: '加载中',
        icon: 'loading'
    })
    wx.request({
        url: url,
        method: params.method || 'GET',
        data: params.data || {},
        header: {
            'Content-Type': 'application/json'
        },
        success: (res) => {
            params.success && params.success(res)
            wx.hideToast()
        },
        fail: (res) => {
            params.fail && params.fail(res)
        },
        complete: (res) => {
            params.complete && params.complete(res)
        }
    })
}

const getBanner = (params) => wxRequest(params, 'https://api.it120.cc/26f2408d0cfa5f15d5d9c5cd17bf70ad/banner/list');

const getProducts = (params) => wxRequest(params, 'https://api.it120.cc/26f2408d0cfa5f15d5d9c5cd17bf70ad/shop/goods/list');

const getProductDetail = (params) => wxRequest(params, 'https://api.it120.cc/26f2408d0cfa5f15d5d9c5cd17bf70ad/shop/goods/detail');

const login = () => {
    // 登录
    wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                app.globalData.userInfo = res.userInfo
  
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (app.userInfoReadyCallback) {
                    app.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
}

export default {
    getBanner,
    getProducts,
    getProductDetail,
    login
}