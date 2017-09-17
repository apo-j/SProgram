//index.js
//获取应用实例
var app = getApp();
import WxParse from '../../wxParse/wxParse';
import api from '../../apis/api';

Page({
  data: {
    goodsDetail:{},
    swiperCurrent: 0,  
    shopNum:0,
    hideShopPopup:true,
    propertyChildIds:"",
    propertyChildNames:"",
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
  },

  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  onLoad: function (e) {
    var that = this;
    api.getProductDetail({
      data: {
        id: e.id
      },
      success: function(res) {
        that.data.goodsDetail = res.data.data;
        that.setData({
          goodsDetail:res.data.data
        });
        WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
      }
    })
  },
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function() {
     this.setData({  
        hideShopPopup: false 
    })  
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function() {
     this.setData({  
        hideShopPopup: true 
    })  
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
