//const BASE_URL = 'http://localhost:9991';
const BASE_URL = 'https://test.51he.cn';
const app = getApp();

/**
 * 网络请求封装
 * @param url url路径名 例：/books
 * @param method 请求方式 POST/GET/DELETE等
 * @param data 请求参数 string类型
 * @param success  成功回调
 * @param fail 失败回调
 */
function request(url, method, data, success, fail) {
    if (!fail && !success && typeof data === 'function') {
        // fail = null;
        success = data;
        data = "";
    } else if (!fail) {
        if (typeof data === 'function') {
            fail = success
            success = data
            data = ""
        } else if (typeof data === 'object') {
            // fail = null
        } else {
            console.log("传递参数类型不正确");
        }

    } else {
        console.log("传递参数个数不正确");
    }
    var openid = wx.getStorageSync('openid');
    if (openid != undefined && openid.length > 0) {
        data.OpenID = openid;
    }

    let wxtask = wx.request({
        url: BASE_URL + '/api' + url,
        header: {
            'app-type': 'wx-app'
        },
        method: method,
        data: data,
        success: function (res) {
            console.log(res);
            switch (res.statusCode) {
                case 10000:
                case 10001:
                case 10002:
                case 10004:
                case 200:
                    success(res.data)
                    break
                default:
                    break
            }
        },
        fail: function (res) {
            console.log(res);
            if (fail) {
                fail(res)
            }
        }
    })


    return wxtask;
}


/**
 * 请求封装-Get
 * @param url 请求地址
 * @param data 请求参数
 * @param success 成功回调
 * @param fail  失败回调
 * @constructor
 *
 * 返回值为微信请求实例   用于取消请求
 */
function Get(url, data, success, fail) {
    return request(url, "GET", data, success, fail)
}


/**
 * 请求封装-Post
 * @param url 请求地址
 * @param data 请求参数
 * @param success 成功回调
 * @param fail  失败回调
 * @constructor
 *
 * 返回值为微信请求实例   用于取消请求
 */
function Post(url, data, success, fail) {
    return request(url, 'POST', data, success, fail)
}


/**
 * 请求封装-Delete
 * @param url 请求地址
 * @param data 请求参数
 * @param success 成功回调
 * @param fail  失败回调
 * @constructor
 *
 * 返回值为微信请求实例   用于取消请求
 */
function Delete(url, data, success, fail) {
    return request(url, 'DELETE', data, success, fail)
}
exports.Get = Get;
exports.Post = Post;
exports.Delete = Delete;
exports.BASE_URL = BASE_URL;