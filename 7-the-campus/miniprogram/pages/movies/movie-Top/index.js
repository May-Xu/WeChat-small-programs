// pages/movies/movies-soon/index.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieTop: [],
    flag:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var flag = that.data.flag
    wx.showLoading({
      title: '加载中...',
      success(res) {
        that.setData({
          hide: true
        })
      }
    })
    var movieTop = that.data.movieTop;
    wx.request({
      url: 'https://douban.uieee.com/v2/movie/top250',
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      data: {
        start: flag,
        count: 20
      },
      success: res => {
        //console.log(res.data.subjects)
        let movie = res.data.subjects
        for (var i = 0; i < movie.length; i++) {
          var len = movie[i].rating.average.toString().length
          if (movie[i].rating.average == 0.0) {
            movie[i].rating.average = "暂无评分"
          }
          if (len == 1 && movie[i].rating.average != "暂无评分") {
            //console.log("这个奇数是：", movie[i].rating.average)
            movie[i].rating.average = movie[i].rating.average + '.0'
          }
          //console.log(movie[i].rating.average)
          //console.log(typeof (movie[i].rating.average))
        }
        that.setData({
          movieTop: movie,
        })
      },
      fail: () => { },
      complete: () => { }
    });
  },

  socket: function (e) {
    var that = this;
    let flag = that.data.flag;
    wx.request({
      url: 'https://douban.uieee.com/v2/movie/top250',
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      data: {
        start: flag,
        count: 20
      },
      success: res => {
        //console.log(res.data.subjects)
        let movie = res.data.subjects
        for (var i = 0; i < movie.length; i++) {
          var len = movie[i].rating.average.toString().length
          if (movie[i].rating.average == 0.0) {
            movie[i].rating.average = "暂无评分"
          }
          if (len == 1 && movie[i].rating.average != "暂无评分") {
            //console.log("这个奇数是：", movie[i].rating.average)
            movie[i].rating.average = movie[i].rating.average + '.0'
          }
          //console.log(movie[i].rating.average)
          //console.log(typeof (movie[i].rating.average))
        }
        that.setData({
          movieTop:that.data.movieTop.concat(movie),
        })
      },
      fail: () => { },
      complete: () => { }
    });
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

  toDetailsTap: function (event) {
    let detailsID = event.currentTarget.dataset.details;
    console.log("ID为：", detailsID)
    wx.navigateTo({
      url: '../../../pages/movies/movie-details/index?detailsID=' + detailsID,
    })
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
    var flag = this.data.flag
    var movietop = this.data.movieTop
    console.log(movietop.length)
    if (movietop.length == 250) {
      Toast('没有更多了~');
    }
    this.setData({
      flag:flag+20
    })
    this.socket()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})