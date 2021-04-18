 var base64 = require("../images/base64");

Page({
   mixins: [require('../mixin/themeChanged')],
   data:{
     valuePic:"../pic/light.png",
     valuePic1: "../pic/wenshidu.png",
     valuePic2: "../pic/yanwu.png",
     valuePic3: "../pic/xiatou.png"
   },
  onLoad: function () {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
  },
  dwh:function(){
   wx.navigateTo({
     url:'../index/index'
   })
  },
   dwh1: function () {
    wx.navigateTo({
      url: '../wsd/wsd'
    })
  },
  flame: function () {
    wx.navigateTo({
      url: '../flame/flame'
    })
  },
  people: function () {
    wx.navigateTo({
      url: '../people/people'
    })
  },
  bo:function(){
    wx.makePhoneCall({
      phoneNumber: '17835696234', //这个是我的手机号，模拟测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //震动效果
vibrate:function(){
  wx.vibrateLong({
    success: function () {
      console.log("震动成功！")
    },
    fail: function () {
      console.log("震动失败！")
    }
  })
},
});
