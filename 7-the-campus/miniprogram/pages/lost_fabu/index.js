var util = require('../../utils/util.js')
const app1 = getApp()
var app = getApp()
var result = new Array()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    limit: 3,
    urlList2: [],
    biaoti: '',
    details: '',
    contact: '',
    radio: '',
    index: 0,
    biaoti: null,
    details: null,
    contact: null,
    counterId: '',
    count: null,
    image: null,
    images: [],
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      details: e.detail.value,
    })
  },

  chooseImage: function (e) {
    var that = this;
    if (this.data.images.length < 1) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            images: that.data.images.concat(res.tempFilePaths)
          });
        }
      })
    } else {
      wx.showToast({
        title: '最多上传一张图片',
        icon: 'warn',
        duration: 3000
      });
    }
  },

  deleteimg: function (e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images,
      image: null
    });
  },

  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = [];
    var objkeys = Object.keys(this.data.images);
    for (var i = 1; i <= objkeys.length; i++) {
      imgArr.push(this.data.images[i]);
    }
    wx.previewImage({
      current: imgArr[index],//当前图片地址
      urls: imgArr
    })
  },

  //失去焦点时获取输入框内容
  bindbiaoti: function (e) {
    this.setData({
      biaoti: e.detail.value,
    })
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      details: e.detail.value,
    })
  },
  bindcontact: function (e) {
    this.setData({
      contact: e.detail.value,
    })
  },
  bindweixin: function (e) {
    this.setData({
      weixin: e.detail.value,
    })
  },

  /******************************** */
  //上传图片
  uploadImages() {
    var images = this.data.images;
    for (var i = 0; i < images.length; i++) {
      wx.showLoading({
        title: '发布中',
      })

      //生成随机字符串
      var str = Math.random().toString(36).substr(2);

      const filePath = images[i];
      const cloudPath = 'lost/' + str + filePath.match(/\.[^.]+?$/)[0];

      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          this.setData({
            image: res.fileID
          });
        },
        fail: e => {
          this.onAdd();
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          wx.hideLoading();
          //上传数据
          this.onAdd();
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /*************这里有一点bug，没有判断，直接进入提交表单的函数了******************* */
  up_img: function (e) {
    var biaoti = this.data.biaoti;
    var details = this.data.details;
    var contact = this.data.contact;
    var weixin = this.data.weixin;
    var image = this.data.image;
    if (biaoti === null || biaoti == '') {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (details === null) {
      wx.showToast({
        title: '请填写详情',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (contact === null) {
      wx.showToast({
        title: '请填写联系人',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (weixin === undefined) {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (image == null) {
      this.setData({
        image: "cloud://xu-75d8e6.7875-xu-75d8e6/default/lost.jpg"
      })
      this.lostandfoundMsgFormSubmit(e);
    }/*else if (weixin.length != 0 && weixin.length != 11 && weixin.length != 8) {
      wx.showToast({
        title: '请输入格式正确的手机号码',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } */else {
      this.lostandfoundMsgFormSubmit(e);
    }
  },
  lostandfoundMsgFormSubmit(e) {
    var details1 = this.data.details;
    var images = this.data.images;
    var time = util.formatTime(new Date());
    this.setData({
      time: time
    });
    this.setData({
      //details1:details
    })

    //判断有无图片，如果有图片就进入uploadImages函数
    //如果没有图片就进入onAdd函数
    if (images.length != 0) {
      this.uploadImages();
    } else {
      this.onAdd();
    }
  },
  //上传数据
  onAdd: function (e) {
    var biaoti = this.data.biaoti;
    var details = this.data.details;
    var contact = this.data.contact;
    var weixin = this.data.weixin;
    var image = this.data.image;
    var time = this.data.time;
    var radio = '失物所';
    const db = wx.cloud.database()
    /********************下面是快递的集合************************************ */
    db.collection('lost').add({
      //
      data: {
        biaoti: this.data.biaoti,
        details: this.data.details,
        contact: this.data.contact,
        weixin: this.data.weixin,
        image: this.data.image,
        time: this.data.time,
        radio: '失物所'
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          biaoti: biaoti,
          details: details,
          contact: contact,
          weixin: weixin,
          image: image,
          time: time,
          radio: radio
        })
        wx.showToast({
          title: '发布成功请刷新',
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
    wx.showToast({
      title: '发布成功请刷新',
    })
    wx.navigateBack({
      delta: 1
    })
    this.deleteimg()
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