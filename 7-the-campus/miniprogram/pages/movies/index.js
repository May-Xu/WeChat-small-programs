Page({

  /**
   * 页面的初始数据
   */
  data: {
    in_theaters: [],
    coming_soon: [],
    movieTop:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var in_theaters = that.data.in_theaters
    wx.showLoading({
      title: '加载中...',
      success(res) {
        that.setData({
          hide: true
        })
      }
    })
    wx.request({
      url: 'https://douban.uieee.com/v2/movie/in_theaters',
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      data: {
        start: 0,
        count: 6,
        city: '长沙'
      },
      success: res => {
        console.log(res.data.subjects)
        //console.log("第一个电影的ID是：",res.data.subjects[0].id)
        //console.log("第一个电影的链接地址是：","https://douban.uieee.com/v2/movie/subject/"+res.data.subjects[0].id)
        let movie = res.data.subjects
        for (var i = 0; i < movie.length; i++) {
          var len = movie[i].rating.average.toString().length
          if (len == 1) {
            //console.log("这个奇数是：",movie[i].rating.average)
            movie[i].rating.average = movie[i].rating.average + '.0'
          }
          //console.log(movie[i].rating.average)
          //console.log(typeof(movie[i].rating.average))
        }
        that.setData({
          in_theaters: movie,
        })
      },
      fail: () => { },
      complete: () => { }
    });

    var coming_soon = that.data.coming_soon;
    wx.request({
      url: 'https://douban.uieee.com/v2/movie/coming_soon',
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      data: {
        start: 0,
        count: 6,
        city: '长沙'
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
          coming_soon: movie,
        })
      },
      fail: () => { },
      complete: () => { }
    });

    var movieTop = that.data.movieTop;
    wx.request({
      url: 'https://douban.uieee.com/v2/movie/top250',
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      data: {
        start: 0,
        count: 6
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

  current: function () {
    wx.navigateTo({
      url: '/pages/movies/movie-current/index',
    })
  },
  soon: function () {
    wx.navigateTo({
      url: '/pages/movies/movie-soon/index',
    })
  },
  top250: function () {
    wx.navigateTo({
      url: '/pages/movies/movie-Top/index',
    })
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
  toDetailsTap: function (event){
    let detailsID = event.currentTarget.dataset.details;
    console.log("ID为：", detailsID)
    wx.navigateTo({
      url: '../../pages/movies/movie-details/index?detailsID=' + detailsID,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})