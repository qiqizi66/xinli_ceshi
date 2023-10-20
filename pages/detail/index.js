// pages/detail/index.js

const request = require('../../utils/request')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    douyin: "/images/but_douyin.png",
    item: {
    },
    detailId: "",
    icons: {
      icon05: "/images/ic_hot.png",
      icon06: "/images/ic_recommended.png",
      play: "/images/play.png",
      back: "/images/back.png",
      home: "/images/home.png"
    },
    bg: 1,
    topDistance: app.globalData.headerBtnPosi.top,
    backHeight: 0,
    backWidth: 0,
    leftDistance: 0,
    hasHome: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var rg = Math.ceil(5 * Math.random());
    that.setData({
      bg: rg,
      detailId: options.id

    });
    wx.showLoading({
      title: '加载题目中···',
    })
    request.Post("/Test_Topic/Load", {
      ID: options.id
    }, function (data) {
      if (data.status) {
       wx.hideLoading({
         success: (res) => {},
       })
        that.setData({
          item: data.data
        })
      }
    })

  },
  changeIndex: function (e) {
    var index = e.detail.index;
    var order = e.detail.order;
    var prevStatus = e.detail.prevStatus;
    var item = this.data.item;
    var questionTpe = item.questionType;
    if (questionTpe == "SCORE"||questionTpe=="MBTI") {
      if (typeof (order) == "number") {
        var cross = item.crossHeadList[order];
        cross.checked = index;
        if (!prevStatus&&order<item.crossHeadList.length-1) {
          order++;
        }
      } else {
        item.checked = index;
      }
    } else if (questionTpe == "REDIRECT") {
      if (typeof (order) == "number") {
        var cross = item.crossHeadList[order];
        cross.checked = item.checked = index;
        if (!prevStatus && cross.questionOptList[index].redirectSerialNum) {
          var redirectOrder = cross.questionOptList[index].redirectSerialNum - 1;
          if (redirectOrder >= 0) {
            order = redirectOrder;
            if (item.crossHeadList[order]) {
              item.crossHeadList[order].prevNumber = cross.serialNum - 1;
            }
          }
        }
        if (item.crossHeadList[order].questionOptList[index]) {
          item.answerSeq = item.crossHeadList[order].questionOptList[index].answerSeq
        }
      }
    } else {
      item.checked = index;
      item.answerResult = item.crossHeadList[0].questionOptList[index].answerSeq
    }

    this.setData({
      item: item,
      ['item.selected']: order
    });
  },
  backHandle: function () {
    let pages = getCurrentPages();
        if(pages[pages.length - 2]){
          //如果有上一页，就返回上一页
          wx.navigateBack({//返回
            delta: 1
          })
        }else{
          wx.redirectTo({
            url: '/pages/index/index'
           })
         }
  },
  backHome: function () {
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },
  onShareAppMessage: function (e) {
    var t = this.data.item,
      a = t.topicID;
    return {
      title: t.title,
      imageUrl: t.coverImgUrl,
      path: "".concat("/pages/detail/index", "?id=").concat(a)
    };
  },
  onShareTimeline: function (e) {
    var t = this.data.item,
      a = t.topicID;
    return {
      title: t.title,
      imageUrl: t.coverImgUrl,
      path: "".concat("/pages/detail/index", "?id=").concat(a)
    };
  }
})