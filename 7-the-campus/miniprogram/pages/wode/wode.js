const app = getApp()
Page({
  data: {
    actionSheetHidden: true,
    active: 0,
    userInfo: {},
    steps: [{
      text: '08.31 v1.4.4',
      desc: '增加土味情话模块'
    },{
        text: '08.28 v1.4.3',
        desc: '增加主页天气显示'
      },{
      text: '08.06 v1.4.2',
      desc: '解决了一些bug和发现bug的人'
    },{
      text: '07.30 v1.4.1',
      desc: '个人中心页面改版，增加版本改动显示'
    },{
      text: '07.29 v1.4.0',
      desc: '首页改版，增加首页显示动画'
    },{
      text: '07.21 v1.3.3',
      desc: '增加长沙美食介绍'
    },{
      text: '07.15 v1.3.2',
      desc: '增加心情专区页面'
    },{
      text: '07.09 v1.3.1',
      desc: '增加豆瓣电影页面'
    },{
      text: '06.20 v1.3.0',
      desc: '增加任务启事'
    },{
      text: '06.10 v1.2.2',
      desc: '启事详情页样式改版'
    },{
      text: '06.03 v1.2.1',
      desc: '每件启事样式改版'
    },{
      text: '05.25 v1.2.0',
      desc: '启事页改版，增加轮播图'
    },{
      text: '05.16 v1.1.2',
      desc: '去除发布启事的tabBar'
    },{
      text: '05.15 v1.1.1',
      desc: '首页改版'
    }, {
      text: '05.05 v1.1.0',
      desc: '修改个人中心的样式'
    }, {
      text: '04.22 v1.0.5',
      desc: '加入用户可以自主删除发布的启事'
    }, {
      text: '04.17 v1.0.4',
      desc: '修复图片上传bug'
    },{
      text: '04.13 v1.0.3',
      desc: '小程序企业资质认证成功'
    }, {
      text: '04.01 v1.0.2',
      desc: '接入云开发'
    },{
      text: '03.25 v1.0.1',
      desc: '完成四个平台前端展示'
    },{
      text: '2019.03.02 v1.0.0',
      desc: '构建思路'
    }]
  },
  onChange(event) {
    const {
      key
    } = event.currentTarget.dataset;
    this.setData({
      [key]: event.detail
    });
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})