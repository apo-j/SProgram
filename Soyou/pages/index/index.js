//index.js
import api from '../../apis/api';

//获取应用实例
var app = getApp()
Page({
  data: {
    // UI
    swiperCurrent: 0,  
    selectCurrent:0,
    activeCategoryId: 0,

    // Data
    categories: [{icon: "../../images/categories/icon-new-list1.png", name: "成衣", id: 2012},
                {icon: "../../images/categories/icon-new-list2.png", name: "箱包", id: 2013},
                {icon: "../../images/categories/icon-new-list3.png", name: "鞋履", id: 2014},
                {icon: "../../images/categories/icon-new-list4.png", name: "珠宝", id: 2015}],    
    goods:[],
    scrollTop:"0",
    loadingMoreHidden:true,

    hasNoCoupons:true,
    coupons: []
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function(e) {
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  tapCategory: function (e) {
    var data = e.currentTarget.dataset
    app.globalData.currentCate = {name: data.name, id: data.id}
    wx.navigateTo({
      url: `../category/index?id=${data.id}`
    })
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },  
  scroll: function (e) {
    var that = this,scrollTop=that.data.scrollTop;
    that.setData({
      scrollTop:e.detail.scrollTop
    })
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('appName')
    })
    api.getBanner({
      success: function(res) {
        that.setData({
          banners: res.data.data
        });
      }
    })
    that.setData({
          activeCategoryId:0
        });
    that.getGoodsList(0);
  },
  getGoodsList: function (categoryId) {
    if (!categoryId) {
      categoryId = "";
    }

    var that = this;
    api.getProducts({
      data: {
        categoryId: categoryId
      },
      success: function(res) {
        that.setData({
          goods:[],
          loadingMoreHidden:true
        });

        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden:false,
          });
          return;
        }

        that.setData({
          goods:[...res.data.data],
        });
      }
    })
  },
  getCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
      data: {
        type: ''
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.data
          });
        }
      }
    })
  },
  gitCoupon : function (e) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功，赶紧去下单吧~',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName'),
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getNotice: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/last-one',
      data: {},
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            noticeMap: res.data.data
          });
        }
      }
    })
  }
})
