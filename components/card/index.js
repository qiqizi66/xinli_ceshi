var e = require("../../utils/helpers/interopRequireDefault")(require("../../utils/helpers/typeof")),

    o = getApp();
const request = require('../../utils/request')
let videoAd = null
Component({
    properties: {
        item: {
            type: Object,
            value: {},
            observer: function (e, t) {
                this._myPropertyChange(e, t);
            }
        }
    },
    detached(){
        // console.log('销毁')
        // if (videoAd) videoAd.destroy();
        // videoAd = null;
    },

    data: {
        defalutimg: '/images/but_douyin.png',
        banner: "/images/bdd.png",
        play: "/images/play.png",
        checkedIndex: "",
        selectIndex: 0,
        showResult: !1,
        isAdShow: !0,
        btnText: "查看结果"
    },
    attached: function (gg) {
        var e = this.data.item,
            t = 0;
        e && "number" == typeof e.selected && (t = e.selected), e.selected = t, this.setData({
            selectIndex: t,
            item: e
        });
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-80b61eafb1e57e8e'
            })
            videoAd.onLoad(() => {});
            videoAd.onError((err) => {
                console.log("拉取失败直接跳转");
                wx.redirectTo({
                    url: "/pages/answer/index"
                });
            });
            videoAd.onClose((res) => {
                if (res && res.isEnded) {
                    // 正常播放结束，可以下发游戏奖励
                    wx.redirectTo({
                        url: "/pages/answer/index"
                    });
                } else {
                    // 播放中途退出，不下发游戏奖励
                }


            })
        }
    },
    
    methods: {
        checkHandle: function (e) {
            var t = e.currentTarget.dataset.index,
                s = this.data.item,
                n = this.data.selectIndex,
                o = s.questionType;
            this.setData({
                checkedIndex: t
            });
            var i = {
                index: t
            };

            if ("number" == typeof s.selected && (i.order = n), "SCORE" == o) n == s.crossHeadList.length - 1 && this.setData({
                showResult: true
            });
            else if ("REDIRECT" == o) {
                s.crossHeadList[n].questionOptList[t].redirectSerialNum ? this.setData({
                    showResult: false
                }) : this.setData({
                    showResult: true
                });
            } else if ("MBTI" == o) {
                if (n == s.crossHeadList.length - 1) {
                    this.setData({
                        showResult: true
                    });
                }
            } else this.setData({
                showResult: true
            });
            if (this.data.showResult) {
                if (this.data.item.freeTest == 0) {
                    this.setData({
                        btnText: '支付' + this.data.item.testAmount.toString() + '元查看结果'
                    });
                }
            }

            this.triggerEvent("changeIndex", i);
        },
        jumpPrev: function () {

            var e = this.data.item,
                t = e.questionType,
                s = this.data.selectIndex;
            var questionType = this.data.item.questionType;
            var selectIndex = this.data.selectIndex;

            "REDIRECT" == t ? (s = e.crossHeadList[s].prevNumber, this.triggerEvent("changeIndex", {
                index: e.crossHeadList[s].checked,
                prevStatus: !0,
                order: s
            })) : --s >= 0 && this.triggerEvent("changeIndex", {
                index: e.crossHeadList[s].checked,
                prevStatus: !0,
                order: s
            });
        },
        jumpToAnswer: function () {
            var that = this;
            wx.setStorageSync("questionAnswer", that.data.item);
            if (that.data.item.freeTest == 1) {
                that.playAd();
                // wx.redirectTo({
                //     url: "/pages/answer/index"
                // });
                return;
            }
            wx.showLoading({
                title: '加载中···',
            })
            var paymentData = {};
            request.Post("/Test_Topic/Payment", {
                ID: that.data.item.topicID,
                QuestionType: that.data.item.questionType
            }, function (data) {
                if (data.status) {
                    wx.hideLoading({
                        success: (res) => {},
                    })

                    paymentData = data.data

                    wx.requestPayment({
                        'timeStamp': paymentData.timeStamp,
                        'nonceStr': paymentData.nonceStr,
                        'package': paymentData.package,
                        'signType': "MD5",
                        'paySign': paymentData.paySign,
                        'success': function (res) {
                            //console.log("支付成功");
                            wx.redirectTo({
                                url: "/pages/answer/index"
                            });
                        },
                        'fail': function (res) {
                            wx.showToast({
                                title: "支付失败",
                                icon: 'none',
                                duration: 2000
                            });
                        },
                        'complete': function (res) {}

                    });


                }
            })

        },
        playAd: function (e) {
            if (videoAd) {
                videoAd.show().catch(() => {
                    // 失败重试
                    videoAd.load()
                        .then(() => videoAd.show())
                        .catch(err => {
                            console.log('激励视频 广告显示失败')
                        })
                })
            }
        },
        _myPropertyChange: function (t, s) {
            var n = this;
            t && "number" == typeof t.selected && ((0, e.default)(t.crossHeadList[t.selected].checked) || console.log("还未选择答案"),
                setTimeout(function () {
                    n.setData({
                        selectIndex: t.selected
                    });
                }, 300));
        }
    }
});