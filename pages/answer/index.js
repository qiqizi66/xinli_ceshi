// pages/answer/index.js
var app = getApp();
const request = require('../../utils/request')
Page({

    data: {
        questionCategory: "",
        douyin: "/images/but_douyin.png",
        bg_answer: "/images/bg_answer.png",
        im_answer: "/images/im_answer.png",
        icons: {
            icon05: "/images/ic_hot.png",
            icon07: "/images/xingxing.png",
            icon08: "/images/xingxing02.png",
            play: "/images/play.png",
            back: "/images/back.png"
        },
        list: [],
        result: {

        },
        topDistance: 0,
        backHeight: 0,
        backWidth: 0,
        leftDistance: 0,
        answerImg: "",
        ans: "",
        pageNumber: 1,
        pageSize: 20,
        id: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var anwser = wx.getStorageSync("questionAnswer");

        var e = this,
            t = app.globalData.headerBtnPosi,
            a = app.globalData.winWidth,
            n = t.top,
            r = a - t.right,
            i = t.height,
            s = 2 * i,
            o = this.data,
            u = 'data:image/png;base64,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',
            l = 'data:image/png;base64,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',
            g = Math.ceil(2 * Math.random()),
            d = 'background-image: url('.concat(1 == g ? u : l, ')');
        this.setData({
            topDistance: n,
            leftDistance: r,
            answerImg: d,
            ans: g,
            backWidth: s,
            backHeight: i,
            id: anwser.topicID
        }, function () {
            this.fetchData()

        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.hasMore) {
            this.setData({
                pageNumber: this.data.pageNumber + 1
            })
            this.fetchData();
        }
    },
    onShareAppMessage: function (e) {
        var t = wx.getStorageSync("questionAnswer"),
            a = t.topicID;
            
        return {
            title: t.title,
            imageUrl: t.coverImgUrl,
            path: "".concat("/pages/detail/index", "?id=").concat(a)
        };
    },
    onShareTimeline: function (e) {
        var t = wx.getStorageSync("questionAnswer"),
            a = t.topicID;
            
        return {
            title: t.title,
            imageUrl: t.coverImgUrl,
            path: "".concat("/pages/detail/index", "?id=").concat(a)
        };
    },
    jumpDetail: function (e) {
        var t = e.currentTarget.dataset.id;
        if (!t) throw new Error("detail id 缺失");
        wx.redirectTo({
            url: "/pages/detail/index?id=" + t
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
    fetchData() {
        var that = this;
        var answer = wx.getStorageSync("questionAnswer");

        var mbtiResult = "";
        var mbtiDic = new Array()

        var finallyScore = 0;
        var param = {
            ID: answer.topicID,
            QuestionType: answer.questionType
        };
        if (answer.questionType == "MBTI") {
            //将答案整合起来
            answer.crossHeadList.forEach(crossHead => {
                if (crossHead.questionOptList[crossHead.checked].value) {
                    if (mbtiDic[crossHead.questionOptList[crossHead.checked].value]) {
                        mbtiDic[crossHead.questionOptList[crossHead.checked].value] += 1
                    } else {
                        mbtiDic[crossHead.questionOptList[crossHead.checked].value] = 1
                    }
                }
            })

            if ((mbtiDic['E'] | 0) > (mbtiDic['I'] | 0)) {
                mbtiResult += 'E'
            } else {
                mbtiResult += 'I'
            }
            if ((mbtiDic['S'] | 0) > (mbtiDic['N'] | 0)) {
                mbtiResult += 'S'
            } else {
                mbtiResult += 'N'
            }
            if ((mbtiDic['T'] | 0) > (mbtiDic['F'] | 0)) {
                mbtiResult += 'T'
            } else {
                mbtiResult += 'F'
            }
            if ((mbtiDic['J'] | 0) > (mbtiDic['P'] | 0)) {
                mbtiResult += 'J'
            } else {
                mbtiResult += 'P'
            }
            param.JudgeKey = mbtiResult;
        } else if (answer.questionType == "SCORE") {
            //将分数整合起来
            answer.crossHeadList.forEach(crossHead => {
                if (crossHead.questionOptList[crossHead.checked].score) {
                    finallyScore += crossHead.questionOptList[crossHead.checked].score
                }
            })
            param.Score = finallyScore;
        } else {
            var selectedSubject = answer.crossHeadList[answer.selected]
            param.JudgeKey = selectedSubject.questionOptList[selectedSubject.checked].value;
        }

        request.Post("/Test_Judge/Load", param, function (data) {
            if (data.status) {
                if (answer.questionType == "SCORE") {
                    data.data.answerDesc = data.data.answerDesc.replace(/\$score/g, finallyScore);
                }
                that.setData({
                    result: data.data
                })
            }
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
    }
})