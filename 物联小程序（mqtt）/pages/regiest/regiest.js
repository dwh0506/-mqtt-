// pages/login/login.js
Page({
  data:{
   userName:'',
   userPassword:'',
  },
   
  formSubmit:function(e){
   console.log(e.detail.value);//格式 Object {userName: "user", userPassword: "password"}
   
   //获得表单数据
   var objData = e.detail.value;
   if(objData.userName=="" || objData.userPassword==""){
    wx.showToast({
      title: '请输入信息',

    })

   }
   if(objData.userName && objData.userPassword){
    // 同步方式存储表单数据
    wx.setStorageSync('userName', objData.userName);
    wx.setStorageSync('userPassword', objData.userPassword);
    wx.showToast({
      title: '注册成功',

    })
    //跳转到成功页面
    wx.navigateTo({
     url: '../login/login'
    })
   }
  },
   
  //加载完后，处理事件 
  // 如果有本地数据，则直接显示
  onLoad:function(options){
   //获取本地数据
   var userName = wx.getStorageSync('userName');
   var userPassword = wx.getStorageSync('userPassword');
   console.log(userName);
   console.log(userPassword);
   if(userName&&userPassword){
    this.setData({userName: userName});
    this.setData({userPassword: userPassword});
    wx.reLaunch({
      url: '../login/login'
     })
   }
 
   
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