import mqtt from'../../utils/mqtt.js';
//连接的服务器域名，注意格式！！！
const host = 'wxs://www.dwhwulian.top/mqtt';

let that = null;
Page({
  data: {
    public:'/open/2',
    msg: {},
    text: { },
    value:"",
    valuePic: '../pic/iLED1.png',
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId: 'lightTest3',
      clean: false,
      password: '12346',
      username: 'light',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    }
  }, 



  onLoad: function () {
   
    var that = this;
   
    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);
  
    this.data.client.on('connect', function (connack) {
      wx.showToast({
        title: '欢迎进入灯控设备'
      })
    })


    //服务器下发消息的回调
    that.data.client.on("message", function (topic, payload) {
   
      console.log(" 收到 topic:" + topic + " , payload :" + payload)
      //收到的json数据转为字符串
      var msg1 = JSON.parse(payload)
      //将字符串转为对象数组
      var msg2 = JSON.stringify(msg1)
      //把值存储
      that.data.msg=msg2
      // wx.showModal({
      //   content: " 收到topic:[" + topic + "], payload :[" + payload + "]",
      //   showCancel: false,
      // });
       that.setData({
         text:that.data.msg,
         
       })
       var msg9 = JSON.parse(that.data.text)
      //  console.log(msg9.msg);
       that.setData({
        value: msg9,
        
      })
      // console.log(that.data.value.msg);
    //   var createArr = []

    //   for (let i in that.data.text) {
    //     createArr.push(that.data.text[i]);
    //   }
    //   var ce = that.data.text[8] + that.data.text[9] + that.data.text[10] + that.data.text[11]
    //  // console.log(ce)
    //   that.data.value = ce
    //   that.setData({
    //     value: that.data.value,

    //   })
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
//下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    console.log('onPullDownRefresh')
    var msgg = that.msg
    console.log(msgg)
    wx.showModal({
      content: msgg.value + msgg.msg,
      showCancel: false,
    });
  },


 
  onClickOpen() {
    var that = this;
    var temp ;
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish('/open/2', '1');
      wx.showToast({
        title: '开灯成功'
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
      this.data.client.publish('/open/2', '2');
      wx.showToast({
        title: '关灯成功'
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
  onClick_weqther() {
    var that = this;
    var temp ;
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish(that.data.public, '3');
      wx.showToast({
        title: '天气模式开启'
      })
      temp = '../pic/weather.png'
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
  onClick_SubOne: function () {
    var that = this;
    var text = that.data.text;
    if (this.data.client && this.data.client.connected) {
      //仅订阅单个主题
      this.data.client.subscribe('/open', function (err, granted) {
        if (that.data.value.msg== "open" && !err) {
          wx.showToast({
            title: '开启状态',

          })
          //  console.log(that.data.value)
          // console.log("1111111111")
        }
        else if (that.data.value.msg == "off") {
          wx.showToast({
            title: '关闭状态',
          })
        } else {
          wx.showToast({
            title: '稍后重试',
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
})