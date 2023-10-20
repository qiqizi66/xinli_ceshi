// pages/search/index.js
const request = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    douyin: "/images/but_douyin.png",
    icons: {
      del: "/images/del.png",
      ic_search: "/images/ic_search.png",
      ic_delete: "/images/ic_delete.png",
      ic_hot: "/images/ic_hot.png",
      no: "/images/no.png",
      back: "/images/back.png",
      icon06: "/images/ic_recommended.png",
    },
    keyWord: "",
    winHeight: "",
    pageNumber: 1,
    pageSize: 20,
    questionCategory: "",
    list: [
    ],
    fetchDataDone: false,
    hasMore:false
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return {
        title: "趣测研究所",
        path: "/pages/index/index"
    };
},
onShareTimeline: function (e) {
    return {
        title: "趣测研究所",
        path: "/pages/index/index"
    };
},
  onLoad(){

  },
  backHandle: function() {
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
  clearHandle: function() {
      var e = this;
      this.setData({
          list: [],
          keyWord: "",
          pageNumber: 1
      });
  },
  fetchData() {
    var that = this;
    request.Post("/Test_Topic/LoadList", {
        PageSize: that.data.pageSize,
        PageNumber: that.data.pageNumber,
        KeyWord:that.data.keyWord
    }, function (data) {
        wx.hideLoading({
          success: (res) => {},
        })
        if (data.status) {
            var hasmore = data.data.length == that.data.pageSize ? true : false
            that.setData({
                list: that.data.list.concat(data.data),
                hasMore: hasmore
            })
        }
    })
},
  searchHandle: function() {
      var e = this;
      this.data.keyWord && (wx.showLoading({
          title: "搜索中"
      }), this.setData({
          list: [],
          pageNumber: 1
      }, function() {
          e.fetchData();
      }));
  },
  handleInput: function(e) {
     var keyword = e.detail.value;
     this.setData({
      keyWord:keyword
     })
  },
  handleConfirm: function(e) {
      var t = this, a = e.detail.value;
      this.setData({
          keyWord: a
      }, function() {
          a || t.fetchData();
      });
  },
  jumpDetail: function(e) {
      var t = e.currentTarget.dataset.id;
      if (!t) throw new Error("detail id 缺失");
      wx.navigateTo({
          url: "/pages/detail/index?id=" + t
      });
  }
})