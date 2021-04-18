// pages/login/login.js
Page({
  data:{
   userName:'',
   userPassword:'',
   storName:'',
   storPassword:'',
  },
   
  formSubmit:function(e){
  //  console.log(e.detail.value);//格式 Object {userName: "user", userPassword: "password"}
  //  console.log(this.data.storName);
  //  console.log(this.data.storPassword);
   //获得表单数据
   var that=this;
   var objData = e.detail.value;
   if(objData.userName=="" || objData.userPassword==""){
    wx.showToast({
      title: '请输入信息',

    })

   }
   if(objData.userName==wx.getStorageSync('userName') && objData.userPassword==wx.getStorageSync('userPassword')){
    // 同步方式存储表单数据
    // wx.setStorageSync('userName', objData.userName);
    // wx.setStorageSync('userPassword', objData.userPassword);
 
    //跳转到成功页面
    wx.reLaunch({
     url: '../main/main'
    })
   }else{
    wx.showToast({
      title: '信息错误',

    })
   }
  },
   
  //加载完后，处理事件 
  // 如果有本地数据，则直接显示
  onLoad:function(options){
  // console.log(this.data.storName);
  // console.log(this.data.storPassword);
    var that=this;
    
   //获取本地数据
   var userName = wx.getStorageSync('userName');
   var userPassword = wx.getStorageSync('userPassword');
   console.log(userName);
   console.log(userPassword);
   if(userName&&userPassword){
    // this.setData({userName: storName});
    // this.setData({userPassword: storPassword});
    that.data.storName=userName;
    that.data.storPassword=userPassword;
    console.log(that.data.storName);
    console.log(that.data.storPassword);
   }
  //  if(wtorPassword){
  //   this.setData({userPassword: userPassword});
  //  }
   
  },
  reset:function(){
    wx.clearStorage();
    wx.navigateTo({
      url: '../regiest/regiest'
    })
  },
  onReady:function(){
   // 页面渲染完成
  },
  onShow:function(){
   // 页面显示
  },
  onHide:function(){
   // 页面隐藏
  },
  onUnload:function(){
   // 页面关闭
  }
 })