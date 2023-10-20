// app.js
const request = require('/utils/request')
App({
  onLaunch() {
    var that=this;
    var t = wx.getSystemInfoSync();
    that.globalData.winHeight = t.screenHeight * (750 / t.windowWidth);
    that.globalData.winWidth = t.windowWidth;
    that.globalData.statusBarHeight = t.statusBarHeight;
    that.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect();
    var o = wx.getLaunchOptionsSync();
    that.globalData.scene = o.scene;

    // 登录
    wx.login({
      success: res => {
        request.Post("/Test_UserInfo/login", {
          "code": res.code
        }, function (data) {
          that.globalData.openid = data
          wx.setStorageSync('openid', data)
        })
      }
    })

   
  },
  globalData: {
    openid:'',
    winHeight: "",
    winWidth: "",
    statusBarHeight: "",
    headerBtnPosi: {},
    sence: "",
    skey: "",
    key: "",
    BannerList:[],
    CatalogList:[]
  }
})