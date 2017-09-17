//index.js
import api from '../../apis/api';

//获取应用实例
var app = getApp()
Page({
  data: {
    // UI
    swiperCurrent: 0,  
    selectCurrent:0,

    // Data
    categories: [{icon: "../../images/categories/icon-new-list1.png", name: "成衣", id: 2012, imageUrl: 'https://cdn.it120.cc/apifactory/2017/09/15/f791d2637ff435e80f1c9898ada318a1.jpg'},
                {icon: "../../images/categories/icon-new-list2.png", name: "箱包", id: 2013, imageUrl: 'https://cdn.it120.cc/apifactory/2017/09/15/9f39b454cfbc9c8fa61cfe929374aa02.jpg'},
                {icon: "../../images/categories/icon-new-list3.png", name: "鞋履", id: 2014, imageUrl: 'https://cdn.it120.cc/apifactory/2017/09/15/c2f4b983104c1848ebefbd7b5f13299c.jpg'},
                {icon: "../../images/categories/icon-new-list4.png", name: "珠宝", id: 2015, imageUrl: 'https://cdn.it120.cc/apifactory/2017/09/15/bedb5a2ec984f0845c059d82ab08e5b5.jpg'}],    
    goods:[],
    scrollTop:"0",
    loadingMoreHidden:true
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
      url: `../category/index?id=${data.id}&name=${data.name}`
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
        categoryId: categoryId,
        recommendStatus: 1
      },
      success: function(res) {
        const goods = [];
        that.setData({
          goods:goods,
          loadingMoreHidden:true
        });

        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden:false,
          });
          return;
        }

        for(let cate of that.data.categories){
           cate.items = [...res.data.data.filter((good) => {
             return good.categoryId === cate.id;
           })];

           goods.push(cate);
        }

        that.setData({
          goods:[...goods],
        });
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
