import mqtt from '../../utils/mqtt.js';
//连接的服务器域名，注意格式！！！
const host = 'wxs://www.dwhwulian.top/mqtt';

let that = null;

Page({

  data: {

    msg: {},
    text: [{ "requestId": "{000000000}", "reported": { "Temperature": 0, "Humidity": 0 } }],
    value: "等待设备连接",
    shidu:"等待设备连接",
    valuePic: '../pic/iLED1.png',
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId: 'wsdTest3',
      clean: false,
      password: '12346',
      username: 'wsd',
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
      value: "等待设备连接",
      shidu: "等待设备连接",
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
        title: '欢迎进入温湿度'
      })
    })

    this.data.client.subscribe('/WSD')
    //服务器下发消息的回调
    that.data.client.on("message", function (topic, payload) {

      console.log(" 收到 topic:" + topic + " , payload :" + payload)
      //收到的json数据转为字符串
      var msg1 = JSON.parse(payload)
      //将字符串转为对象数组
      var msg2 = JSON.stringify(msg1)
      //把值存储
      that.data.msg = msg1
      // wx.showModal({
      //   content: " 收到topic:[" + topic + "], payload :[" + payload + "]",
      //   showCancel: false,
      // });
      that.setData({
        text: that.data.msg,

      })
      console.log(that.data.text.requestId)
      console.log(that.data.text.reported.Temperature)
      console.log(that.data.text.reported.Humidity)
      var wendu = that.data.text.reported.Temperature
      var shidu = that.data.text.reported.Humidity
      that.setData({
        value: that.data.text.reported.Temperature,
        shidu: that.data.text.reported.Humidity
      })
         if(that.data.value>37){
          wx.showToast({
            title: ' 注意防暑',
            duration:3000,//显示时长
          });

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
  // //下拉刷新 (可以自定义事件)
  // onPullDownRefresh: function () {
  //   var that = this;
  //   console.log('onPullDownRefresh')
  //   var msgg = that.msg
  //   console.log(msgg)
  //   wx.showModal({
  //     content: msgg.value + msgg.msg,
  //     showCancel: false,
  //   });
  // },
  //定义按钮判断
 onClick_SubOne: function () {
    var that = this;
    var text = that.data.text;
    if (this.data.client && this.data.client.connected) {
      //仅订阅单个主题
      this.data.client.subscribe('/WSD', function (err, granted) {
        if (that.data.value == "无") {
          wx.showToast({
            title: '当前设备未登录',

          })
          that.setData({
      value: 0,
      shidu: 0,

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
  onClickOpen() {
    var that = this;
    var temp ;
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish('/WSD/1', 'LED_ON');
      wx.showToast({
        title: '开启成功'
      })
      temp = '../pic/iLED2.png'
      that.setData({
        valuePic: temp,
      })

    } else {
      wx.showToast({
        title: '正在连接设备',
        icon: 'none',
        duration: 2000
      })
    }
    that.setData({
      valuePic: temp,
    })
  },
  onClickOff() {
    var that = this;
    var temp;
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish('/WSD/1', 'LED_OFF');
      wx.showToast({
        title: '关闭成功'
      })
      temp = '../pic/iLED1.png'
     
    } 
    else {
      wx.showToast({
        title: '正在连接设备',
        icon: 'none',
        duration: 2000
      })
    }
    that.setData({
      valuePic: temp,
    })
  },
})