//app.js
import api from './apis/api';

App({
    onLaunch: function () {
      var that = this;
      wx.setStorageSync('appName', that.globalData.appName);
      api.login();
    },
    globalData: {
    userInfo:null,
    appName: '奢有',
    subDomain: '26f2408d0cfa5f15d5d9c5cd17bf70ad'
  }
})