
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
var util = require('../../utils/util.js');
const app = getApp();
const amap = require('../../amap-wx.js');
const key = '3f9d13bd84dd2fa23c8bdbba8e2ec788';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    inputShowed: false,
    show: false,
    today: "",
    address: '',
    weather: '',
    temperature: '',
    humidity: '',
    windpower: '',
    winddirection: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //更新当前日期
    app.globalData.day = util.formatTime(new Date()).split(' ')[0];
    this.setData({
      today: app.globalData.day
    });
    var myAmap = new amap.AMapWX({ key: '3f9d13bd84dd2fa23c8bdbba8e2ec788' });
    myAmap.getWeather({
      type: 'live',
      success: function (data) {
        if (data.city) {
          _this.setData({
            address: data.liveData.city,
            humidity: data.liveData.humidity,
            temperature: data.liveData.temperature,
            weather: data.liveData.weather,
            winddirection: data.liveData.winddirection,
            windpower: data.liveData.windpower
          })
        }
      },
      fail: function (info) {
        wx.showToast({ title: '获取天气失败！' })
        console.log(info)
      }
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  lost: function () {
    wx.navigateTo({
      url: '/pages/lost/index',
    })
  },
  find: function () {
    wx.navigateTo({
      url: '/pages/find/index',
    })
  },
  love: function () {
    wx.navigateTo({
      url: '/pages/love/index',
    })
  },
  acting: function () {
    wx.navigateTo({
      url: '/pages/Courier/index',
    })
  },
  olds: function () {
    wx.navigateTo({
      url: '/pages/olds/index',
    })
  },
  find_campus: function () {
    wx.navigateTo({
      url: '/pages/shouye/index',
    })
  },
  kuaidi_campus: function () {
    wx.navigateTo({
      url: '/pages/Courier/index',
    })
  },
  teasing: function () {
    wx.navigateTo({
      url: '/pages/teasing/index',
    })
  },
  movie:function(){
    wx.navigateTo({
      url: '/pages/movie/index',
    })
  },
  food:function(){
    wx.navigateTo({
      url: '/pages/food/index',
    })
  },
  tourism:function(e){
    wx.showToast({
      title: '此功能尚在开发中！敬请期待',
      icon: 'none',
      duration: 2000
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
    this.setData({
      show: true
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      show: false
    })

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