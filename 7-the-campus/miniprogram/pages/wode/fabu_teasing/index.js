const app = getApp()
Page({
  data: {
    step: 1,
    openid: '',
    teasing: [],
    teasing_id: '',
    hide: true,
    delIndex: -1,//左滑删除索引
    information: false
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
    db.collection("teasing").orderBy('time', 'desc').get({
      success: res => {
        this.setData({
          teasing_id: res.data
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
            title: '获取 openid 失败',
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
    // 查询当前用户所有的 teasing
    db.collection('teasing').where({
      _openid: this.data.openid
    }).orderBy('time', 'desc').get({
      success: res => {
        this.setData({
          teasing: res.data
        })
        console.log('[数据库] [查询记录] 成功， 他的值为：', res.data.teasing_id)
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
    var teasing = this.data.teasing
    console.log("teasing的值为", teasing)
    if (teasing.length > 0) {
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
          console.log("点击确认")
          db.collection("teasing").doc(id).remove({
            success: res => {
              wx.showToast({
                title: '删除成功请刷新',
              })
            },
            fail: err => {
              console.log("删除失败")
            }
          })
        } else if (res.cancel) {
          console.log("点击取消");
        }
      }
    })
  },
  touchStart: function (e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      delIndex: -1
    })
  },

  touchMove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      delIndex = that.data.delIndex,
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (touchMoveX > startX) {//右滑 
      delIndex = -1;
    } else {
      delIndex = index;
    }
    that.setData({
      delIndex: delIndex
    })
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
})