var app = getApp()
const app1 = getApp()
Page({
  data: {
    /** 
       * 页面配置 
       */
    winWidth: 0,
    winHeight: 0,
    user: [],
    page: 1,
    pageSize: 8,
    hide: true,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    imgUrls1: [
      '/images/love_1.jpg',
      '/images/love_2.jpg',
      '/images/love_3.jpg',
    ]
  },
  swiperChange1(e) {
    const that = this;
    that.setData({
      swiperIndex1: e.detail.current,
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {

    //获取最新记录
    this.setData({
      page: 1,
      user: []
    });
    console.log("更新后的page:" + this.data.page)
    this.queryPageOne();
    wx.stopPullDownRefresh();
  },
  //查询数据
  onQuery: function () {
    var pageNum = this.data.page;
    if (pageNum == 1) {
      this.queryPageOne();
    } else {
      this.queryByPage();
    }
  },
  /**
   * 第一页查询
   */
  queryPageOne: function () {
    const db = wx.cloud.database();
    var that = this;
    //页码
    var pageNum = that.data.page;
    //一页的记录数1gf
    var pageSize = that.data.pageSize;
    //user
    var res = that.data.user;
    // 查询当前用户所有的 counters
    db.collection('user').limit(pageSize).orderBy('time', 'desc').get({
      success: res => {

        //追加数据
        // this.data.user.unshift(res.data);
        this.setData({
          // user: JSON.stringify(res.data, null, 2)
          user: this.data.user.concat(res.data),
          page: pageNum + 1
        })
        console.log('[数据库] [查询记录] 成功: ', res.data);

        //下载图片内容
        this.downloadImageContent();
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
  /**
   * 分页查询 不是第一页使用这个方法
   */
  queryByPage: function () {
    const db = wx.cloud.database();
    var that = this;
    //页码
    var pageNum = that.data.page;
    //一页的记录数1gf
    var pageSize = that.data.pageSize;
    //user
    var res = that.data.user;
    // 查询当前用户所有的 counters
    db.collection('user').skip((pageNum - 1) * pageSize).limit(pageSize).orderBy('time', 'desc').get({
      success: res => {

        //追加数据
        // this.data.user.unshift(res.data);
        this.setData({
          // user: JSON.stringify(res.data, null, 2)
          user: this.data.user.concat(res.data),
          page: pageNum + 1
        })
        console.log('[数据库] [查询记录] 成功: ', res.data);

        //下载图片内容
        this.downloadImageContent();
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

  //下载图片内容
  downloadImageContent() {
    var postList = this.data.user;
    for (var i = 0; i < postList.length; i++) {
      console.log("test fileId " + i + postList[i].image);

      wx.cloud.downloadFile({
        fileID: postList[i].image,
        success: res => {
          console.log("临时路径：" + res.tempFilePath);

          var tempPath = 'postList[' + i + '].image';
          this.setData({
            [tempPath]: res.tempFilePath
          })
        }
      })
    }
  },
  onLoad: function (e) {
    var self = this;
    wx.showLoading({
      title: '加载中...',
      success(res) {
        self.setData({
          hide: true
        })
      }
    })
    //this.onQuery();//分页加载
    if (e.path) {
      url = decodeURIComponent(e.path)
    }

    /** 
     * 获取系统信息 
     */
    var that = this
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    //调用应用实例的方法获取全局数据
    app1.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  onReady:function(){
    var self = this
    setTimeout(function () {
      wx.hideLoading()
      self.setData({
        hide: false
      })
    }, 2000)
  },
  onShow: function () {
    //获取最新记录
    this.setData({
      page: 1,
      user: []
    });
    console.log("更新后的page:" + this.data.page)
    this.queryPageOne();
  },
  //点击悬浮按钮跳转
  link_jump: function () {
    wx.navigateTo({
      url: '/pages/love_fabu/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.onQuery();

  },
  toDetailsTap: function (event) {
    let aid = event.currentTarget.dataset.aid;
    let biaoti = event.currentTarget.dataset.biaoti;
    let image = event.currentTarget.dataset.image;
    let details = event.currentTarget.dataset.details;
    let time = event.currentTarget.dataset.time;
    let radio = event.currentTarget.dataset.radio;
    let contact = event.currentTarget.dataset.contact;
    let weixin = event.currentTarget.dataset.weixin;
    console.log("详情", details)
    wx.navigateTo({
      url: '/pages/details/details?aid=' + aid + '&biaoti=' + biaoti + '&image=' + image + '&details=' + details + '&time=' + time + '&radio=' + radio + '&contact=' + contact + '&weixin=' + weixin
    })
  },

  /**
   * 用户点击右上角分享2
   */
  onShareAppMessage: function (res) {
    let webViewUrl = encodeURIComponent(res.webViewUrl);
    return {
      title: service.shareTitle + title,//'7号校园',
      path: util.getCurrentPageURL() + '?path=${webViewUrl}',//'pages/shouye/shouye?aid=' +this.data.aid,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})