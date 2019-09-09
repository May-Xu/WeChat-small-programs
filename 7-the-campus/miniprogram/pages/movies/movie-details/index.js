var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsID : [],
    movie_details:[],
    casts:[],
    type:[],
    actor_img:[],
    comments:[],
    information: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let detailsID = options.detailsID
    //console.log("https://douban.uieee.com/v2/movie/subject/" + detailsID)
    wx.showLoading({
      title: '加载中...',
      success(res) {
        that.setData({
          hide: true
        })
      }
    })
    wx.request({
      url: "https://douban.uieee.com/v2/movie/subject/" + detailsID,
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: res => {
        let movie = res.data
        console.log(res.data)
        var len = movie.rating.average.toString().length
        if (movie.rating.average == 0.0) {
          movie.rating.average = "暂无评分"
        }
        if (len == 1 && movie.rating.average != "暂无评分") {
          movie.rating.average = movie.rating.average + '.0'
        }
        let content = movie.popular_comments
        for(let s=0;s<content.length;s++){
          that.setData({
            comments: that.data.comments.concat(content[s])
          })
        }
        let comments = that.data.comments
        console.log(comments)
        let actor = movie.casts
        //console.log(actor.length)
        for (let i = 0; i < actor.length; i++) {
          //console.log(actor[i].name)
          that.setData({
            casts: that.data.casts.concat(actor[i].name),
            //actor_name: that.data.actor_name.concat(i)
          })
          that.setData({
            actor_img: that.data.actor_img.concat(actor[i])
          })
        }
        let actor_img = that.data.actor_img
        console.log(actor_img)
        let casts = that.data.casts
        let plot = movie.genres
        that.setData({
          movie_details: movie,
          type: plot.join(' / '),
          casts: casts.join(' / ')
        })
        //that.video()
      }
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
  previewImage:function(e){
    var path = e.currentTarget.dataset.path
    wx.previewImage({
      current: path,
      urls: [path] 
    })
  },
  bindButtonTap: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  videoErrorCallback: function (e) {
    console.log(e)
  },/*
  video: function (e) {
    let movie_details = this.data.movie_details.trailer_urls[0];
    if (movie_details.length == 0) {
      this.setData({
        information: false
      })
    }
  },*/

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