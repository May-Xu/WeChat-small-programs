const app = getApp()
Page({
  data: {
    step: 1,
    openid: '',
    biaoti: '',
    olds: [],
    olds_id: '',
    hide: true,
    information:false
  },
  onShow: function () {
    var self = this
    setTimeout(function () {
      wx.hideLoading()
      self.setData({
        hide: false
      })
    }, 2000)
  },
  onLoad: function (options) {
    var self = this;
    wx.showLoading({
      title: '加载中...',
      success(res) {
        self.setData({
          hide: true
        })
      }
    })
    /**监听页面加载 */
    const db = wx.cloud.database()
    db.collection("olds").orderBy('time', 'desc').get({
      success: res => {
        this.setData({
          olds_id: res.data
        })
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
    //检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
          this.onQuery()
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function () { } : function () {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
    this.onQuery()
  },
  //下拉刷新
  onPullDownRefresh: function () {

    this.onQuery()
    wx.stopPullDownRefresh();
  },
  onQuery: function () {
    const db = wx.cloud.database()
    var _this = this;
    // 查询当前用户所有的 olds
    db.collection('olds').where({
      _openid: this.data.openid
    }).orderBy('time', 'desc').get({
      success: res => {
        this.setData({
          olds: res.data
        })
        console.log('[数据库] [查询记录] 成功， 他的值为：', res.data.olds_id)
        this.mation()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  mation: function (e) {
    var olds = this.data.olds
    console.log("olds的值为", olds)
    if (olds.length > 0) {
      this.setData({
        information: true
      })
      console.log("调用成功")
    } else {
      this.setData({
        information: false
      })
    }
  },
  onRemove: function (e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database();
    var that = this
    //弹出模拟框
    wx.showModal({
      title: '删除',
      content: '确定要删除该启事吗?',
      success: function (res) {
        if (res.confirm) {
          //点击确认
          db.collection("olds").doc(id).remove({
            success: res => {
              wx.showToast({
                title: '删除成功请刷新',
              })
            }
          })
        } else if (res.cancel) {
          console.log("点击取消");
        }
      }
    })
  },

  toDetailsTap: function (event) {
    let biaoti = event.currentTarget.dataset.biaoti;
    let image = event.currentTarget.dataset.image;
    let details = event.currentTarget.dataset.details;
    let time = event.currentTarget.dataset.time;
    let contact = event.currentTarget.dataset.contact;
    let weixin = event.currentTarget.dataset.weixin;
    let radio = event.currentTarget.dataset.radio;
    console.log("详情" + details)
    wx.navigateTo({
      url: '/pages/details/details?biaoti=' + biaoti + '&image=' + image + '&details=' + details + '&time=' + time + '&contact=' + contact + '&weixin=' + weixin + '&radio=' + radio
    })
  }
})