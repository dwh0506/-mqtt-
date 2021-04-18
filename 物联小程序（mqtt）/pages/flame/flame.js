import mqtt from '../../utils/mqtt.js';
//连接的服务器域名，注意格式！！！
const host = 'wxs://www.dwhwulian.top/mqtt';

let that = null;

Page({

  data: {
    msg: {},
    text: [{ "requestId": "{000000000}", "reported": { "Temperature": 0, "Humidity": 0 } }],
    orderstate:0,
    value: "当前设备未连接",
    change: '../pic/sav.png',
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId: 'flame001',
      clean: false,
      password: '12346',
      username: 'flame',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    }
  },

  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    // const restart=that.onLoad();
    console.log('onPullDownRefresh')
    that.setData({
      value: "正在刷新",
      client: null,
      //记录重连的次数
      reconnectCounts: 0,
      value:""
    })
    this.onLoad(); //服务器重连连接异常的回调
    that.data.client.on("reconnect", function () {
      console.log(" 服务器 reconnect的回调")

    })
  },

  onLoad: function () {

    var that = this;
    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);
    this.data.client.on('connect', function (connack) {
      wx.showToast({
        title: '欢迎进入'
      })
    })
    this.data.client.subscribe('/dwh003/flame')
    //服务器下发消息的回调
    that.data.client.on("message", function (topic, payload) {
      console.log(" 收到 topic:" + topic + " , payload :" + payload)
      //把值存储
      that.data.msg = payload[0]
      that.setData({
        text: that.data.msg,

      })
      console.log(that.data.text)
      if (that.data.text == 110) {
        that.setData({
          change: '../pic/sav.png',
          value: "家里安全",
          orderstate:false,
        })
      } else if (that.data.text == 104) {
        that.setData({
          orderstate:true,
          change: '../pic/fire.png',
          value: "家里着火！！！！",

        })
        that.vibrate();
      }
      else if (that.data.text == 115) {
        that.setData({
          orderstate:1,
          change: '../pic/smoke.png',
          value: "警告 燃气泄漏！！！！",

        })
        that.vibrate();
      }
    })
    //服务器连接异常的回调
    that.data.client.on("error", function (error) {
      console.log(" 服务器 error 的回调" + error)
    })
    //服务器重连连接异常的回调
    that.data.client.on("reconnect", function () {
      console.log(" 服务器 reconnect的回调")

    })
    //服务器连接异常的回调
    that.data.client.on("offline", function (errr) {
      console.log(" 服务器offline的回调")

    })
  },

  onClick_SubOne: function () {
    var that = this;
    var text = that.data.text;
    if (this.data.client && this.data.client.connected) {
      //仅订阅单个主题
      this.data.client.subscribe('/dwh003/flame', function (err, granted) {
        if (that.data.value == "未登录") {
          wx.showToast({
            title: '当前设备未登录',

          })
        }
        else {
          wx.showToast({
            title: '设备在线',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '正在连接设备',
        icon: 'none',
        duration: 2000
      })
    }
  },


  sendCommond(cmd, data) {
    let sendData = {
      cmd: cmd,
      data: data,
    };
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish(this.data.aliyunInfo.pubTopic, JSON.stringify(sendData));

    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    this.data.client.end()  // 关闭连接
    console.log('服务器连接断开')
  },
  //震动
  vibrate: function () {
    wx.vibrateLong({
      success: function () {
        console.log("震动成功！")
      },
      fail: function () {
        console.log("震动失败！")
      }
    })
  },
  bo: function () {
    wx.makePhoneCall({
      phoneNumber: '119', //这个是我的手机号，模拟测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  gooutUrl: function () {
    wx.navigateTo({
      url: '../test/web', //
      success: function () {

      },       //成功后的回调；
      fail: function () { },         //失败后的回调；
      complete: function () { }      //结束后的回调(成功，失败都会执行)
    })
  }
})