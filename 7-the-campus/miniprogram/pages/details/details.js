var app = getApp()
Page({
  data: {
    biaoti:[],
    image:[],
    time:[],
    details:[],
    radio: [],
    contact: [],
    weixin: [],
    userInfo: {}
  },
  onLoad:function(e){
    let biaoti = e.biaoti;
    let image = e.image;
    let time = e.time;
    let details = e.details;
    let radio = e.radio;
    let contact = e.contact;
    let weixin = e.weixin;
    var that = this
    console.log("详情" + details)
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    this.setData({
      biaoti: e.biaoti,
      image: e.image,
      time: e.time,
      details: e.details,
      radio: e.radio,
      contact: e.contact,
      weixin: e.weixin
    })
  },
  textPaste:function(e) {
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: this.data.weixin,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  //预览图片
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var shuzu=[];
    var imgArr = [];
    var objkeys = Object.keys(this.data.image);
    for (var i = 0; i <= objkeys.length; i++) {
      imgArr.push(this.data.image[i]);
    }
    var image = this.data.image;
    var that = this;
    console.log("图片地址："+image)
    wx.cloud.getTempFileURL({
      fileList: [image],
      success: res => {
        for(let i in res.fileList[0]){
          shuzu.push(res.fileList[0][i])
        }
        console.log(shuzu[1])
        var url=shuzu[1]
        var urls=url.split();
        console.log(urls)
        wx.previewImage({
          current: imgArr[index],//当前图片地址
          urls: urls,
          success: function (res) {
            console.log("预览成功")
          },
          fail: function (res) {
            console.log("预览失败")
          },
          complete: function (res) {
            console.log("预览结束" + imgArr[index])
          },
        })
        //console.log(res.fileList.tempFileURL)
      },
      fail: console.error
    })
    console.log("回调成功")
  },
})