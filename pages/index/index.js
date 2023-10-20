// index.js
// 获取应用实例
const app = getApp()
const request = require('../../utils/request')
Page({
    data: {
        douyin: "/images/but_douyin.png",
        icons: {
            icon01: "/images/ic_luck.png",
            icon02: "/images/qinggan.png",
            icon03: "/images/quwei2.png",
            icon04: "/images/xingge.png",
            icon05: "/images/ic_hot.png",
            icon06: "/images/ic_recommended.png",
            icon07: "/images/ic_search_2.png"
        },
        bannerList: [],
        banner: {
            indicatorDots: true,
            indicatorColor: "rgba(255, 255, 255, .56)",
            indicatorActiveColor: "blue",
            autoplay: true,
            interval: 3000,
            circular: true,
            vertical: false,
            duration: 500
        },
        keyWord: "",
        pageNumber: 1,
        pageSize: 20,
        questionCategory: "",
        list: [],
        status: false,
        topDistance: "",
        lineHeight: "",
        avticeTopStatus: false,
        paddingHeight: 0,
        adShow: false,
        catalogList: [],
        hasMore: true
    },

    onLoad() {
        var that = this;

        that.fetchData();
    },
    fetchData() {
        var that = this;

        request.Post("/Test_Banner/LoadBannerList", {}, function (data) {
            that.setData({
                bannerList: data.data
            })
        })

        request.Post("/Test_Catalog/LoadCatalogList", {}, function (data) {
            that.setData({
                catalogList: data.data
            })
        })

        request.Post("/Test_Topic/LoadList", {
            PageSize: that.data.pageSize,
            PageNumber: that.data.pageNumber
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
    lowerScroll: function () {
        if (this.data.hasMore) {
            this.setData({
                pageNumber: this.data.pageNumber + 1
            })
            this.fetchData();
        }
    },
    jumpDetail: function (e) {
        console.log(e);
        var t = e.currentTarget.dataset.id;
        if (!t) throw new Error("detail id 缺失");
        wx.navigateTo({
            url: "/pages/detail/index?id=" + t
        });
    },
    jumpBannerDetail: function (e) {
        var item = e.currentTarget.dataset.item;
        
        console.log(item)
       if(item.bannerType=="MiniPrograme"){
        wx.navigateToMiniProgram({
            appId: item.remark,
            path: item.redirectUrl,
            envVersion: 'develop',
            success(res) {
              // 打开成功
            },
            fail(res){
              // 打开失败
            },
            complete(res){
              // 调用结束  不管成功还是失败都执行
            }
          })
        }
       else if(item.bannerType!="None"){
            wx.navigateTo({
                url: item.redirectUrl
            });
        }
    },
    jumpList: function (e) {
        var t = e.currentTarget.dataset.cate;
        var id = e.currentTarget.dataset.id;
        if (!t) throw new Error("分类名称缺失");
        if (!id) throw new Error("分类 id 缺失");
        wx.navigateTo({
            url: "/pages/list/index?cataid=" + id + "&cate=" + encodeURIComponent(t)
        });
    },
    jumpSearch: function () {
        wx.navigateTo({
            url: "/pages/search/index"
        });
    },
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
    }
})