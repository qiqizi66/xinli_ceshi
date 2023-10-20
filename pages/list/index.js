// pages/list/index.js
const request = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    douyin: "/images/but_douyin.png",
    icons: {
      icon01: "/images/ic_luck.png",
      icon02: "/images/qinggan.png",
      icon03: "/images/quwei2.png",
      icon04: "/images/xingge.png",
      icon05: "/images/ic_hot.png",
      back: "/images/back_left_01.png",
      back2: "/images/back_left_02.png"
    },
    keyWord: "",
    pageNumber: 1,
    pageSize: 20,
    questionCategory: "",
    list: [],
    status: false,
    topDistance: 0,
    backHeight: 0,
    backWidth: 0,
    leftDistance: 0,
    lineHeight: "",
    activeTopStatus: false,
    paddingHeight: 0,
    CatalogID: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      CatalogID: options.cataid
    });
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.cate)
    });

    this.fetchData();
  },
  fetchData() {
    var that = this;
    request.Post("/Test_Topic/LoadList", {
      PageSize: that.data.pageSize,
      PageNumber: that.data.pageNumber,
      CatalogID: that.data.CatalogID
    }, function (data) {

      if (data.status) {
        var hasmore = data.data.length == that.data.pageSize ? true : false
        that.setData({
          list: that.data.list.concat(data.data),
          hasMore: hasmore
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('自带触底')
  },
  bindscroll: function (t) {

  },
  lowerScroll: function () {
    if (this.data.hasMore) {
      this.setData({
        pageNumber: this.data.pageNumber + 1
      })
      this.fetchData();
    }
  },
  jumpDetail: function (t) {
    var e = t.currentTarget.dataset.id;
    if (!e) throw new Error("detail id 缺失");
    wx.navigateTo({
      url: "/pages/detail/index?id=" + e
    });
  },
  backHandle: function () {
    let pages = getCurrentPages();
    if (pages[pages.length - 2]) {
      //如果有上一页，就返回上一页
      wx.navigateBack({ //返回
        delta: 1
      })
    } else {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },
  onShareAppMessage: function (t) {
    var e = this.data.questionCategory,
      a = "/pages/list/index?cate=" + encodeURIComponent(e),
      i = "";
    return "趣味测试" == e ? i = icons.icon03 : "爱情测试" == e ? i = icons.icon02 : "缘分测试" == e ? i = icons.icon01 : "性格测试" == e && (i = icons.icon04), {
      title: e,
      imageUrl: i,
      path: a
    };
  },
  onShareTimeline: function (t) {
    var e = this.data.questionCategory,
      a = "/pages/list/index?cate=" + encodeURIComponent(e),
      i = "";
    return "趣味测试" == e ? i = icons.icon03 : "爱情测试" == e ? i = icons.icon02 : "缘分测试" == e ? i = icons.icon01 : "性格测试" == e && (i = icons.icon04), {
      title: e,
      imageUrl: i,
      path: a
    };
  }
})