var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 20,
    letter:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.onQuery();//分页加载
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
    var res = that.data.letter;
    // 查询当前用户所有的 counters
    db.collection('love-letter').get({
      success: res => {
        this.setData({
          letter: this.data.letter.concat(res.data),
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
    var res = that.data.letter;
    // 查询当前用户所有的 counters
    db.collection('love-letter').skip((pageNum - 1) * pageSize).limit(pageSize).get({
      success: res => {
        this.setData({
          letter: this.data.letter.concat(res.data),
          page: pageNum + 1
        })
        console.log('[数据库] [查询记录] 成功: ', res.data);
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

  textPaste: function (e) {
    let content = e.currentTarget.dataset['respon'];
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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