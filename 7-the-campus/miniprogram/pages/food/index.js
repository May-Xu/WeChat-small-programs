const app = getApp()
Page({
  data: {
    /** 
       * 页面配置 
       */
    winWidth: 0,
    winHeight: 0,
    userInfo: {},
    food: [],
    page: 1,
    isNone: false,
    loading: false,
    pageSize: 20,
    hide: true,
    prompt: ""
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
    this.onQuery();//分页加载
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
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
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
    //food
    var res = that.data.food;
    // 查询当前用户所有的 counters
    db.collection('food').limit(pageSize).orderBy('top', 'asc').get({
      success: res => {

        //追加数据
        // this.data.food.unshift(res.data);
        this.setData({
          // food: JSON.stringify(res.data, null, 2)
          food: this.data.food.concat(res.data),
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
    //food
    var res = that.data.food;
    // 查询当前用户所有的 counters
    db.collection('food').skip((pageNum - 1) * pageSize).limit(pageSize).orderBy('top', 'asc').get({
      success: res => {

        //追加数据
        // this.data.food.unshift(res.data);
        this.setData({
          // food: JSON.stringify(res.data, null, 2)
          food: this.data.food.concat(res.data),
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
    var postList = this.data.food;
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this
    setTimeout(function () {
      wx.hideLoading()
      self.setData({
        hide: false
      })
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.onQuery();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})