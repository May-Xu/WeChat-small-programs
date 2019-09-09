var util = require('../../utils/util.js')
const app1 = getApp()
var app = getApp()
var result = new Array()
Page({
  data: {
    details: '',
    details: null,
    author: null,
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
  },
  bindTextAreaBlur: function (e) {
    console.log("心情的数据：" + this.data.details)
    this.setData({
      details: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.uploadAvatar();
  },
  //获取用户信息
  uploadAvatar() {
    //用户头像
    var that = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        });
      }
    });
  },
  reset:function(e){
    var that = this;
    var details = that.data.details;
    that.setData({
      details:''
    })
  },
  /*************这里有一点bug，没有判断，直接进入提交表单的函数了******************* */
  up_img: function (e) {
    var details = this.data.details;
    if (details == null || details == '') {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else {
      this.lostandfoundMsgFormSubmit(e);
    }
  },
  lostandfoundMsgFormSubmit(e) {
    var time = util.formatTime(new Date());
    this.setData({
      time: time,
    });
    this.onAdd();
  },
  //上传数据
  onAdd: function (e) {
    var details = this.data.details;
    var time = this.data.time;
    var author = this.data.userInfo.nickName;
    var avatarUrl = this.data.userInfo.avatarUrl;
    console.log("心情的数据：" + details)
    const db = wx.cloud.database()
    /********************下面是快递的集合************************************ */
    db.collection('teasing').add({
      //
      data: {
        details: this.data.details,
        time: this.data.time,
        author: this.data.userInfo.nickName,
        avatarUrl: this.data.userInfo.avatarUrl
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          details: details,
          author: author,
          time: time,
          avatarUrl: avatarUrl
        })
        wx.showToast({
          title: '发布成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '发布失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    wx.navigateBack({
      delta: 1
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})