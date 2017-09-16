import api from '../../apis/api';

const app = getApp();

Page({
  data: {
    loadingMoreHidden: false,
    title: '',
    goods: null,
    accountType: '',
    cateName: null
  },

  onLoad: function(option) {
  },

  onShow() {
    var that = this;
    var cate = app.globalData.currentCate;

    this.setData({cateName: cate.name})
    that.getGoodsList(cate.id);
  },

  onReady() {
    wx.setNavigationBarTitle({ title: this.data.cateName})
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
      success: (res) => {
        const goods = [...res.data.data];
        that.setData({
          goods: goods,
          loadingMoreHidden: true
        });
        
        wx.setStorage({
          key: `cate_${that.data.cateId}`,
          data: goods
        })

        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden:false,
          });
          return;
        }
      },
      fail: () => {
        var key = `cate_${that.data.categoryType}`;
        var data = wx.getStorage(key);
        wx.setData({items: data});
      }
    })
  },
  bindTapProduct: function(e) {
    var that = this

    wx.navigateTo({
      url: `../show_product/show_product?id=${e.currentTarget.dataset.id}&type=${this.data.categoryType}`
    })
  }
})
