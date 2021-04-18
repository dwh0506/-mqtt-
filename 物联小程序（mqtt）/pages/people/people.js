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
    change: '../pic/home.png',
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId: 'people001',
      clean: false,
      password: '12346',
      username: 'people',
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
    // this.data.client.end();
    that.setData({
      value: 0,
      client: null,
      //记录重连的次数
      reconnectCounts: 0,
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

    this.data.client.subscribe('/dwh004/people')
    //服务器下发消息的回调
    that.data.client.on("message", function (topic, payload) {

      console.log(" 收到 topic:" + topic + " , payload :" + payload)
      //收到的json数据转为字符串
      // var msg1 = JSON.parse(payload)
      // //将字符串转为对象数组
      // var msg2 = JSON.stringify(msg1)
      //把值存储
      that.data.msg = payload[0]
      // wx.showModal({
      //   content: " 收到topic:[" + topic + "], payload :[" + payload + "]",
      //   showCancel: false,
      // });
      that.setData({
        text: that.data.msg,

      })
      console.log(that.data.text)
      if (that.data.text==110){
        that.setData({
          change: '../pic/home.png',
          value: "家里安全",
          orderstate:false,
        })
      } else if (that.data.text == 104){
        that.setData({
          orderstate:1,
          change:'../pic/xiatou.png',
          value:"有人入侵",
          
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
      this.data.client.subscribe('/dwh004/people', function (err, granted) {
        if (that.data.value == "未连接") {
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
        title: '正在连接设备',
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
      phoneNumber: '110',
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
      url: '../test/web', 
      success: function () {

      },       //成功后的回调；
      fail: function () { },         //失败后的回调；
      complete: function () { }      //结束后的回调(成功，失败都会执行)
    })
  }
})