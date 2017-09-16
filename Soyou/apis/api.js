const host = 'https://api.it120.cc/mall/';

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

export default {
    getBanner,
    getProducts
}